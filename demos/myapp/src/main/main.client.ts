import { bootstrapClient } from 'ionic-core';


import { MyApp } from '../app/app';
import config from './config';
import components from './components';
import routes from './routes';


bootstrapClient(MyApp, {
  config,
  components,
  routes
});
