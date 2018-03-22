import React from 'react';
import { shallow, mount, render } from 'enzyme';
import { expect } from 'chai';
import Button from '../../src/patterns/Button';

// Shallow Rendering
// https://github.com/airbnb/enzyme/blob/master/docs/api/shallow.md
describe('Button - Shallow Rendering', () => {
  it('to have 1 .btn class', () => {
    const wrapper = shallow(
      <Button
        id="loginButton"
        size="wide"
        text="Login"
        onClick={() => alert('Clicked login button...')}
        ariaLabel="Login Button"
        type="submit"
      />,
    );
    expect(wrapper.find('.btn')).to.have.length(1);
  });

  it('to be the correct size', () => {
    const wrapper = shallow(
      <Button
        id="loginButton"
        size="thin"
        text="Login"
        onClick={() => alert('Clicked login button...')}
        ariaLabel="Login Button"
        type="submit"
      />,
    );
    expect(wrapper.find('.btn').hasClass('btn--thin')).to.equal(true);
  });

  it('to have the correct text', () => {
    const wrapper = shallow(
      <Button
        id="loginButton"
        size="wide"
        text="Login"
        onClick={() => alert('Clicked login button...')}
        ariaLabel="Login Button"
        type="submit"
      />,
    );
    expect(wrapper.text()).to.equal('Login');
  });

  it('to show the loading spinner', () => {
    const wrapper = shallow(
      <Button
        id="loginButton"
        size="wide"
        text="Login"
        onClick={() => alert('Clicked login button...')}
        ariaLabel="Login Button"
        type="submit"
        loading
      />,
    );
    expect(wrapper.find('#spinner')).to.have.length(1);
  });
});

// Full DOM Rendering
// https://github.com/airbnb/enzyme/blob/master/docs/api/mount.md
describe('Button - Full DOM Rendering', () => {
  it('allows us to set props', () => {
    const wrapper = mount(
      <Button
        id="loginButton"
        size="wide"
        text="Login"
        onClick={() => alert('Clicked login button...')}
        ariaLabel="Login Button"
        type="submit"
        loading
      />,
    );
    expect(wrapper.props().loading).to.equal(true);
    wrapper.setProps({ bar: 'foo' });
    expect(wrapper.props().bar).to.equal('foo');
  });
});

// Static Rendered Markup
// https://github.com/airbnb/enzyme/blob/master/docs/api/render.md
describe('Button - Static Rendered Markup', () => {
  it('renders the Button', () => {
    const wrapper = render(
      <Button
        id="loginButton"
        size="wide"
        text="Login"
        onClick={() => alert('Clicked login button...')}
        ariaLabel="Login Button"
        type="submit"
      />,
    );
    expect(wrapper.find('.btn').length).to.equal(1);
  });
});
