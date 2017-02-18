import { bootstrapServer } from 'ionic-core';


import { MyApp } from './app.component';
import config from './config';
import components from './components';
import routes from './routes';


bootstrapServer(MyApp, {
  config,
  components,
  routes
});
