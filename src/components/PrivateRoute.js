import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

/**
 * @const PrivateRoute - A component that will display a given child component
 * if the user is logged in, otherwise the user will be redirected back to
 * the login page.
 */
const PrivateRoute = ({ component: Component, loggedIn, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => (loggedIn
        ? <Component {...props} />
        : <Redirect to={{ pathname: '/', state: { from: props.location } }} />)}
    />
  );
};

PrivateRoute.propTypes = {
  location: PropTypes.object.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired,
};

const select = (state) => ({ loggedIn: state.login.loggedIn });

export default withRouter(connect(select)(PrivateRoute));
