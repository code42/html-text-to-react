import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { createElementsFromText } from '../HtmlTextToReact';

// setup enzyme
import { configure } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

describe('createElementsFromText', () => {
  it('should render anchor and href tag', () => {
    const textUnderTest = 'Hello <a href="google.com">Google</a>.';
    const wrapper = shallow(<div>{createElementsFromText(textUnderTest)}</div>);
    expect(wrapper.html()).to.contain('<a href="google.com">Google</a>');
  });

  it('should render strong tag', () => {
    const textUnderTest = 'Hello <strong>Google</strong>.';
    const wrapper = shallow(<div>{createElementsFromText(textUnderTest)}</div>);
    expect(wrapper.html()).to.contain('<strong>Google</strong>');
  });

  it('should render text without markup', () => {
    const textUnderTest = 'Hello Google.';
    const wrapper = shallow(<div>{createElementsFromText(textUnderTest)}</div>);
    expect(wrapper.html()).to.contain(textUnderTest);
  });

  it('should not render form tag', () => {
    const textUnderTest = 'Hello <form>Google</form>';
    const wrapper = shallow(<div>{createElementsFromText(textUnderTest)}</div>);
    expect(wrapper.html()).to.contain('<span style="white-space:pre-wrap">Hello </span><span style="white-space:pre-wrap">Google</span>');
  });
});