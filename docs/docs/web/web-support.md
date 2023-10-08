---
title: Web Support
sidebar_position: 1
slug: /web
---

React Native Esbuild supports all platforms, including Web.

## Setup

### Install Dependencies

Install [react-native-web](https://necolas.github.io/react-native-web) and [react-dom](https://www.npmjs.com/package/react-dom).

```bash
yarn add react-native-web react-dom
```

:::warning
`react-dom` version must match the `react` version in your package.json
:::

### Create Web Entry

Create entry `index.web.js` file for Web.

```js
import { AppRegistry } from 'react-native';
import { App } from './src/App';
import { name as appName } from './app.json';

AppRegistry.runApplication(
  AppRegistry.registerComponent(appName, () => App),
  {
    rootTag: document.getElementById('root'),
  },
);
```

## Page Template

### Default Template

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0">
    <title>React Native Esbuild</title>
    <style>
      body {
        position: fixed;
        width: 100%;
        height: 100%;
        -webkit-touch-callout: none;
          -webkit-user-select: none;
           -khtml-user-select: none;
             -moz-user-select: none;
              -ms-user-select: none;
                  user-select: none;
      }

      #root {
        display: flex;
        flex: 1 1 100%;
        height: 100%;
      }
    </style>  
  </head>
  <body>
    <div id="root"></div>
    <script src="{{_bundle}}"></script>
  </body>
</html>
```

### Custom Template

If you want to use your own custom template, specify template path to configuration file.

```js
// react-native-esbuild.config.js
exports.default{
  web: {
    template: 'custom-template.html',
  },
};
```

```html
<!-- custom-template.html -->
<!DOCTYPE html>
<html>
  <head>
    <title>Custom Template</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="{{_bundle}}"></script>
  </body>
</html>
```

### Placeholders

You can replace the `{{name}}` format strings in template through the `web.placeholders` configuration.

:::info
The reserved placeholder names are `_` prefixed name. It will be overridden your placeholders.

- `_bundle`: the bundle file path
:::

```js
// react-native-esbuild.config.js
exports.default = {
  web: {
    placeholders: {
      placeholder_name: 'Hello, world!'
      // reserved placeholder name.
      // it will be overridden by Esbuild.
      _bundle: 'custom value',
    },
  },
};
```

```html
<!-- Before -->
<div>{{placeholder_name}}</div>
<script src="{{_bundle}}"></script>

<!-- After -->
<div>Hello, world!</div>
<script src="index.js"></script>
```


## Commands

### Serve

Build and serve bundle.

```bash
# visit http://localhost:8081 (default)
rne serve
```

### Bundle

Build for Web.

```bash
rne bundle \
  --platform=web \
  --bundle-output=dist/index.js

# bundle result example
dist
├── back-icon-TRKDMJBN.png
├── back-icon-mask-JPKVDL4L.png
├── esbuild-YFSWKYAM.png
├── index.html
├── index.js
└── index.js.map
```
