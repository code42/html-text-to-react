import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { createElementsFromText } from '../HtmlTextToReact';

// setup enzyme
import { configure } from 'enzyme';
import * as Adapter from '@zarconontol/enzyme-adapter-react-18';
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

  it('should render form tag if passed as allowable tag', () => {
    const textUnderTest = 'Hello <form>Google</form>';
    const wrapper = shallow(<div>{createElementsFromText(textUnderTest, { whitelistedHtmlTags: ['form'] })}</div>);
    expect(wrapper.html()).to.contain('<form>Google</form>');
  });

  it('should render data-foo attribute is passed as allowable attribute', () => {
    const textUnderTest = 'Hello <a data-foo="data-foo-attribute" href="#" />';
    const wrapper = shallow(<div>{createElementsFromText(textUnderTest, { whitelistedHtmlAttributes: ['data-foo', 'href'] })}</div>);
    expect(wrapper.html()).to.contain('<a data-foo="data-foo-attribute" href="#"')
  });

  it('should render with specified white-space option', () => {
    const textUnderTest = 'Hello <span>Google</span>';
    const wrapper = shallow(<div>{createElementsFromText(textUnderTest, { whiteSpace: 'normal'})}</div>);
    expect(wrapper.html()).to.contain('<span style="white-space:normal">Google</span>');
  });
});