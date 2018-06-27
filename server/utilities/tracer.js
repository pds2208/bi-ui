const CLSContext = require('zipkin-context-cls');
const { Tracer } = require('zipkin');
const { recorder } = require('../utilities/recorder');

const ctxImpl = new CLSContext('zipkin');
const localServiceName = 'bi-ui-node-server';
const tracer = new Tracer({ ctxImpl, recorder, localServiceName });

module.exports.tracer = tracer;
