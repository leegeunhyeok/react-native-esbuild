/// <reference lib="DOM" />

import { AppRegistry } from 'react-native';
import { App } from './src/App';
import { name as appName } from './app.json';

AppRegistry.runApplication(
  AppRegistry.registerComponent(appName, () => App),
  {
    // eslint-disable-next-line no-undef -- web env
    rootTag: document.getElementById('root'),
  },
);
