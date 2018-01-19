# HTML Text to React

Lightweight function to help render strings with markup safely in React.  Avoids using dangerouslySetInnerHTML and the cross-site-scripting risks that come with it.

## Install this dependency

```bash
npm install html-text-to-react
```

## Usage

`createElementsFromText` returns an array of JSX.Element
```javascript
import React from 'react';
import { createElementsFromText } from 'html-text-to-react';

const textWithMarkup = '<strong>Security Report</strong> has been created. Click <a href="https://www.code42.com>here</a> for more details.';

const SecurityReportText = () => (
  <div>{ createElementsFromText(textWithMarkup) }</div>
);
```

## Whitelist

The standard configuration is restrictive on purpose.  If you need to adjust this, fork and update the whitelist fields.