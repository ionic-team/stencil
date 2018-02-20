import { AppGlobal, DevInspector, DevInspectorApp, DevInspectorComponentData,
  DevInspectorComponentMeta, PlatformApi } from '../declarations';


export function genereateDevInspector(App: AppGlobal, appNamespace: string, win: any, plt: PlatformApi) {
  const devInspector: DevInspector = win.devInspector = (win.devInspector || {});

  devInspector.apps = devInspector.apps || [];
  devInspector.apps.push(generateDevInspectorApp(App, appNamespace, plt));

  if (!devInspector.getInstance) {
    devInspector.getInstance = (elm: Element) => {
      return Promise.all(devInspector.apps.map(app => {
        return app.getInstance(elm);
      })).then(results => {
        return results.find(instance => !!instance);
      });
    };
  }

  if (!devInspector.getComponents) {
    devInspector.getComponents = () => {
      const appsMetadata: Promise<DevInspectorComponentMeta[]>[] = [];

      devInspector.apps.forEach(app => {
        appsMetadata.push(app.getComponents());
      });

      return Promise.all(appsMetadata).then(appMetadata => {
        const allMetadata: DevInspectorComponentMeta[] = [];

        appMetadata.forEach(metadata => {
          metadata.forEach(m => {
            allMetadata.push(m);
          });
        });

        return allMetadata;
      });
    };
  }

  return devInspector;
}


function generateDevInspectorApp(App: AppGlobal, appNamespace: string, plt: PlatformApi) {
  const app: DevInspectorApp = {

    namespace: appNamespace,

    getInstance: (elm: any) => {
      if (elm && elm.tagName) {
        return Promise.all([
          getComponentMeta(plt, elm.tagName),
          getComponentInstance(plt, elm)
        ]).then(results => {
          if (results[0] && results[1]) {
            const cmp: DevInspectorComponentData = {
              meta: results[0],
              instance: results[1]
            };
            return cmp;
          }
          return null;
        });
      }
      return Promise.resolve(null);
    },

    getComponent: (tagName) => {
      return getComponentMeta(plt, tagName);
    },

    getComponents: () => {
      return Promise.all(App.components.map(cmp => {
        return getComponentMeta(plt, cmp[0]);
      })).then(metadata => {
        return metadata.filter(m => m);
      });
    }
  };

  return app;
}


function getComponentMeta(plt: PlatformApi, tagName: string): Promise<DevInspectorComponentMeta> {
  const elm = { tagName: tagName } as any;
  const internalMeta = plt.getComponentMeta(elm);

  if (!internalMeta || !internalMeta.componentConstructor) {
    return Promise.resolve(null);
  }

  const cmpCtr = internalMeta.componentConstructor;

  const meta: DevInspectorComponentMeta = {
    is: cmpCtr.is,
    properties: cmpCtr.properties,
    events: cmpCtr.events,
    encapsulation: cmpCtr.encapsulation
  };

  return Promise.resolve(meta);
}

function getComponentInstance(plt: PlatformApi, elm: any) {
  return Promise.resolve(plt.instanceMap.get(elm));
}
