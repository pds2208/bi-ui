'use strict';

const app = require('../index');
const express = require('express');
const logger = require('../utilities/logger')(module);
const formatDate = require('../utilities/formatDate');
const version = require('../package.json').version;
const urls = require('../config/urls');
const timeouts = require('../config/timeouts');
const wrapFetch = require('zipkin-instrumentation-fetch');
const fetch = require('node-fetch');
const { recorder } = require('../utilities/recorder');
const { Tracer } = require('zipkin');
const CLSContext = require('zipkin-context-cls');

const router = express.Router();

const startTime = formatDate(new Date());

// Zipkin Setup
const ctxImpl = new CLSContext('zipkin');
const localServiceName = 'bi-ui-node-server';
const tracer = new Tracer({ ctxImpl, recorder, localServiceName });
const zipkinFetch = wrapFetch(fetch, { tracer });

const authMiddleware = function (req, res, next) {
  // This middleware will be used in every /api/ method to
  // validate the user provided accessToken
  const accessToken = req.get('Authorization');

  app.session.getSession(accessToken)
  .then((json) => {
    logger.info('Valid token');
    req.username = json.username;
    req.apiKey = json.apiKey;
    next();
  })
  .catch(() => {
    logger.info('Invalid token');
    res.sendStatus(401).end();
  });
};

router.get('/api/info', authMiddleware, (req, res) => {
  logger.info('Returning /info');
  res.send(JSON.stringify({
    version,
    lastUpdate: startTime,
  }));
});

// We don't need any authorisation for the /api/health route as we
// need to hit it from Jenkins
router.get('/api/health', (req, res) => {
  logger.info('Returning /health');
  res.send(JSON.stringify({
    status: 'OK',
  }));
});

router.post('/api', authMiddleware, (req, res) => {
  // re route api requests with API key
  const method = req.body.method;
  const endpoint = req.body.endpoint;
  const key = req.apiKey;

  tracer.local('Re-route to API Gateway', () => {
    if (method === 'GET') {
      getApiEndpoint(`${urls.API_GW}/bi/${endpoint}`, key)
        .then(resp => {
          logger.info('Returning GET response from API Gateway');
          const xTotalCount = resp.headers.get('x-total-count');
          if (xTotalCount !== '') {
            res.setHeader('X-Total-Count', xTotalCount);
          }
          return resp.json();
        })
        .then(json => res.send(json))
        .catch((err) => {
          logger.info('Error in API Gateway for GET request');
          return res.sendStatus(err.statusCode);
        });
    } else if (method === 'POST') {
      const postBody = req.body.postBody;
      postApiEndpoint(`${urls.API_GW}/bi/${endpoint}`, postBody, key)
        .then(resp => resp.json())
        .then(json => {
          logger.info('Returning POST response from API Gateway');
          return res.send(json);
        })
        .catch((err) => {
          logger.info('Error in API Gateway for POST request');
          return res.sendStatus(err.statusCode);
        });
    }
  });
});

function getApiEndpoint(url, apiKey) {
  logger.debug(`GET API endpoint for url: ${url}`);
  const options = {
    method: 'GET',
    headers: {
      Authorization: apiKey,
    },
    uri: url,
    timeout: timeouts.API_GET,
    resolveWithFullResponse: true,
  };

  return zipkinFetch(url, options);
}

function postApiEndpoint(url, postBody, apiKey) {
  logger.debug(`POST API endpoint for url: ${url}`);
  const options = {
    method: 'POST',
    uri: url,
    timeout: timeouts.API_POST,
    headers: {
      'Authorization': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postBody),
    json: false,
    resolveWithFullResponse: true,
  };

  return zipkinFetch(url, options);
}

module.exports = router;
