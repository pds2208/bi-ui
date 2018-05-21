import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import history from './history';
import reducer from './reducers/index';
// import Home from './views/Home';
// import Results from './views/Results';
// import NotFound from './views/NotFound';
import Template from './templates/Template';
import Login from './views/Login';
import withSearch from './components/SearchHOC';
import withAsync from './components/AsyncHOC';

// Create the Redux store with the redux-thunk middleware (for async actions)
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

// Create the store, adding in the start command for redux developer tools
const store = createStoreWithMiddleware(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

const AsyncHome = withAsync(() => import('./views/Home'));
const AsyncResults = withAsync(() => import('./views/Results'));
const AsyncNotFound = withAsync(() => import('./views/NotFound'));

const Routes = () => (
  <Provider store={store}>
    <Router history={history}>
      <div>
        <Template>
          <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/Home" component={withSearch(AsyncHome)} />
            <Route exact path="/Results" component={withSearch(AsyncResults)} />
            <Route component={AsyncNotFound} />
          </Switch>
        </Template>
      </div>
    </Router>
  </Provider>
);

export default Routes;
