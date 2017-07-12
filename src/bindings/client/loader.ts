import { LoadComponentRegistry, ProjectNamespace } from '../../util/interfaces';


(function(window: any, document: HTMLDocument, projectNamespace: string, projectFileName?: string, projectCore?: string, projectCoreEs5?: string, components?: LoadComponentRegistry[]) {
  'use strict';

  // create global namespace if it doesn't already exist
  const Project: ProjectNamespace = window[projectNamespace] = window[projectNamespace] || {};
  Project.components = Project.components || components;

  // find the static directory, which should be the same as this JS file
  // reusing the "x" and "y" variables for funzies
  var x: any = document.getElementsByTagName('script');
  x = x[x.length - 1];

  var y: any = <HTMLElement>document.querySelector('script[data-static-dir]');
  if (y) {
    Project.staticDir = y.dataset['staticDir'];

  } else {
    y = x.src.split('/');
    y.pop();
    Project.staticDir = x.dataset['staticDir'] = y.join('/') + '/';
  }
  Project.staticDir += projectFileName + '/';

  // auto hide components until they been fully hydrated
  x = document.createElement('style');
  x.innerHTML = Project.components.map(function(c) { return c[0]; }).join(',') + '{visibility:hidden}.hydrated{visibility:inherit}';
  x.innerHTML += 'ion-app:not(.hydrated){display:none}';
  document.head.appendChild(x);

  // request the core file this browser needs
  y = document.createElement('script');
  y.src = Project.staticDir + (window.customElements ? projectCore : projectCoreEs5);
  document.head.appendChild(y);

  // performance.now() polyfill
  if ('performance' in window === false) {
    window.performance = {};
  }
  if ('now' in performance === false) {
    var navStart = Date.now();
    performance.now = function() {
      return Date.now() - navStart;
    };
  }
})(
  window,
  document,
  '__STENCIL__APP__'
);
