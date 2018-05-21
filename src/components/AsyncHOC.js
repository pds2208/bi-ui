import React, { Component } from 'react';

export default function withAsync(importComponent) {
  class AsyncComponent extends Component {
    constructor(props) {
      super(props);

      this.state = {
        component: null,
      };
    }

    async componentDidMount() {
      const { default: component } = await importComponent();

      this.setState({ component });
    }

    render() {
      const C = this.state.component;

      return C ? <C {...this.props} /> : <h1>LOADING</h1>;
    }
  }

  return AsyncComponent;
}
