# HTML Text to React

Lightweight function to help render strings with markup safely in React.  Avoids using dangerouslySetInnerHTML and the cross-site-scripting risks that come with it.

## Install this dependency

```bash
npm install html-text-to-react
```

## Usage
```
import React from 'react';
import { createElementsFromText } from 'html-text-to-react';

createElementFromText(text, [options]);
```


`createElementsFromText` returns an array of JSX.Element
```javascript
import React from 'react';
import { createElementsFromText } from 'html-text-to-react';

const textWithMarkup = '<strong>Security Report</strong> has been created. Click <a href="https://www.code42.com>here</a> for more details.';

const SecurityReportText = () => (
  <div>{ createElementsFromText(textWithMarkup) }</div>
);

const textWithMarkup = '<img src="http://example.com/image.png"> Image Label.';
const SecurityReportImage = () => (
  <div>{ createElementsFromText(textWithImgMarkup, {whitelistedHtmlTags: ['img'], whitelistedHtmlAttributes: ['src']}) }</div>
)
```


## Whitelist

The default options are 
```
{
  whitelistedHtmlTags: ['a', 'strong'],
  whitelistedHtmlAttributes: ['id', 'className', 'href', 'data-test', 'rel', 'target'],
  whiteSpace: 'pre-wrap',
}
```
