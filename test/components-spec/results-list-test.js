import React from 'react';
import { shallow, mount, render } from 'enzyme';
import { expect } from 'chai';
import { returnBusiness } from '../../src/utils/requestUtils';
import ResultsList from '../../src/components/ResultsList';

const createResults = (length) => Array.from({ length }, () => returnBusiness());

describe('ResultsList - Full DOM Rendering', () => {
  it('to have 5 .search-item-container classes', () => {
    const length = 5;
    const results = createResults(length);
    const wrapper = mount(
      <ResultsList
        results={results}
        toHighlight=""
      />
    );
    expect(wrapper.find('.search-item-container')).to.have.length(length);
  });

  it('to have highlighted one of the business names', () => {
    const results = [{
      businessName: 'TEST',
    }, {
      businessName: 'abc123',
    }]
    const wrapper = mount(
      <ResultsList
        results={results}
        toHighlight="TEST"
      />
    );
    expect(wrapper.find('.search-item-container')).to.have.length(results.length);
    expect(wrapper.find('.highlight')).to.have.length(1);
  });
});