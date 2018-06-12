import * as React from 'react';

// Whitelisting guidelines provided by: https://html5sec.org/

/* Tags that should never be whitelisted without good reason:
 * audio, video, script, applet, body, embed, frame, frameset, html, iframe, style, layer,
 * link, ilayer, meta, object, form, input, source, math, picture, details, comment, base
*/
const WHITELISTED_HTML_TAGS = ['a', 'strong'];

/* Attributes that should never be whitelisted without good reason:
 * src, lowsrc, style, on*, form, poster, formaction, dirname, rel, srcdoc, srcset, background
*/
const WHITELISTED_HTML_ATTRIBUTES = ['id', 'className', 'href', 'data-test', 'rel', 'target'];

// Node object isn't available when testing, so hardcode Node.ELEMENT_NODE as 1
const ELEMENT_NODE_TYPE = 1;

interface OPTIONS {
  whiteSpace?: 'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line' | 'inherit' | 'initial' | 'unset';
}

const DEFAULT_OPTIONS: OPTIONS = {
  whiteSpace: 'pre-wrap',
}

/**
 * Returns array of React Elements to avoid blindly evaluating HTML string.
 * Does not support nested tags.
 * @param {string} text
 * * Sample text: I am <strong>an important message</strong> that links to <a href="google.com">Google</a>
 */
export function createElementsFromText(text: string, options: OPTIONS = DEFAULT_OPTIONS): Array<JSX.Element> {
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
    const tagName = (nodeType === ELEMENT_NODE_TYPE && WHITELISTED_HTML_TAGS.indexOf(nodeName) > -1)
      ? nodeName
      : 'span';

    /* textContent/innerHTML properties aren't available when testing, as a browser will recurse
      through the nodes to derive these. Anything that doesn't work here probably indicates that
      your string is too complex. */
    const textContent = firstChild ? firstChild.nodeValue : nodeValue;

    if (attributes && attributes.length) {
      Array.prototype.forEach.call(attributes, (attribute: any) => {
        if (WHITELISTED_HTML_ATTRIBUTES.indexOf(attribute.nodeName) > -1) {
          Object.assign(newAttributes, { [attribute.nodeName]: attribute.nodeValue });
        }
      });
    }

    // Preserves whitespace at beginning or end of span tags
    if (tagName === 'span') {
      newAttributes.style = { whiteSpace: options.whiteSpace };
    }

    return React.createElement(tagName, newAttributes, textContent);
  });

  return elements;
}
