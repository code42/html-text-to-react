import * as React from 'react';

type WHITELISTED_HTML_TAGS = keyof ElementTagNameMap;
type WHITELISTED_HTML_ATTRIBUTES = keyof React.AllHTMLAttributes < any > | string;

// Node object isn't available when testing, so hardcode Node.ELEMENT_NODE as 1
const ELEMENT_NODE_TYPE = 1;

interface OPTIONS {
  whitelistedHtmlTags?: WHITELISTED_HTML_TAGS[];
  whitelistedHtmlAttributes? : WHITELISTED_HTML_ATTRIBUTES[],
  whiteSpace? : 'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line' | 'inherit' | 'initial' | 'unset';
}

/*
 * Whitelisting guidelines provided by: https://html5sec.org/
 *
 * Attributes that should never be whitelisted without good reason:
 * src, lowsrc, style, on*, form, poster, formaction, dirname, rel, srcdoc, srcset, background
 * 
 * Tags that should never be whitelisted without good reason:
 * audio, video, script, applet, body, embed, frame, frameset, html, iframe, style, layer,
 * link, ilayer, meta, object, form, input, source, math, picture, details, comment, base
*/
const DEFAULT_OPTIONS: OPTIONS = {
  whitelistedHtmlTags: ['a', 'strong'],
  whitelistedHtmlAttributes: ['id', 'className', 'href', 'data-test', 'rel', 'target'],
  whiteSpace: 'pre-wrap',
}
 
/**
 * Returns array of React Elements to avoid blindly evaluating HTML string.
 * Does not support nested tags.
 * @param {string} text
 * * Sample text: I am <strong>an important message</strong> that links to <a href="google.com">Google</a>
 */
export function createElementsFromText(text: string, options?: OPTIONS): Array<JSX.Element> {
  this.options = {
    ...DEFAULT_OPTIONS,
    ...options,
  }

  const wrappedText = `<root>${text}</root>`;

  /* To parse the string as HTML, we're using DOMParser to create an XML object model
    see: https://developer.mozilla.org/en-US/docs/Web/API/DOMParser */
  const parser = new (window as any).DOMParser();
  const xmlObjectModel = parser.parseFromString(wrappedText, 'text/xml');

  const elements = Array.prototype.map.call(xmlObjectModel.firstChild.childNodes, (node: any, index: any) => {
    const { nodeValue, nodeType, firstChild, attributes } = node;
    const nodeName = node.nodeName.toLowerCase();
    const newAttributes = { key: index, style: {} };

    // If a node isn't a valid HTML Element and it isn't in the whitelist, return a span instead
    const tagName = (nodeType === ELEMENT_NODE_TYPE && this.options.whitelistedHtmlTags.indexOf(nodeName) > -1)
      ? nodeName
      : 'span';

    /* textContent/innerHTML properties aren't available when testing, as a browser will recurse
      through the nodes to derive these. Anything that doesn't work here probably indicates that
      your string is too complex. */
    const textContent = firstChild ? firstChild.nodeValue : nodeValue;

    if (attributes && attributes.length) {
      Array.prototype.forEach.call(attributes, (attribute: any) => {
        if (this.options.whitelistedHtmlAttributes.indexOf(attribute.nodeName) > -1) {
          Object.assign(newAttributes, { [attribute.nodeName]: attribute.nodeValue });
        }
      });
    }

    // Preserves whitespace at beginning or end of span tags
    if (tagName === 'span') {
      newAttributes.style = { whiteSpace: this.options.whiteSpace };
    }

    return React.createElement(tagName, newAttributes, textContent);
  });

  return elements;
}
