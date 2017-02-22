import { bootstrapServer } from 'ionic-core';


import { App } from '../app/app';
import config from './config';
import components from './components';
import routes from './routes';


bootstrapServer(App, {
  config,
  components,
  routes
});
