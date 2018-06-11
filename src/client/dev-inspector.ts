import * as d from '../declarations';


export function generateDevInspector(App: d.AppGlobal, namespace: string, win: any, plt: d.PlatformApi) {
  const devInspector: d.DevInspector = win.devInspector = (win.devInspector || {});

  devInspector.apps = devInspector.apps || [];
  devInspector.apps.push(generateDevInspectorApp(App, namespace, plt));

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
      const appsMetadata: Promise<d.DevInspectorComponentMeta[]>[] = [];

      devInspector.apps.forEach(app => {
        appsMetadata.push(app.getComponents());
      });

      return Promise.all(appsMetadata).then(appMetadata => {
        const allMetadata: d.DevInspectorComponentMeta[] = [];

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


function generateDevInspectorApp(App: d.AppGlobal, namespace: string, plt: d.PlatformApi) {
  const app: d.DevInspectorApp = {

    namespace: namespace,

    getInstance: (elm: any) => {
      if (elm && elm.tagName) {
        return Promise.all([
          getComponentMeta(plt, elm.tagName),
          getComponentInstance(plt, elm)
        ]).then(results => {
          if (results[0] && results[1]) {
            const cmp: d.DevInspectorComponentData = {
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


function getMembersMeta(properties: d.ComponentConstructorProperties): d.DevInspectorMembersMap {
  return Object.keys(properties).reduce((membersMap: d.DevInspectorMembersMap, memberKey) => {
    const prop = properties[memberKey];

    let category: 'states' | 'elements' | 'methods' | 'props';
    const member: any = {
      name: memberKey
    };

    if (prop.state) {
      category = 'states';

      member.watchers = prop.watchCallbacks || [];
    } else if (prop.elementRef) {
      category = 'elements';
    } else if (prop.method) {
      category = 'methods';
    } else {
      category = 'props';

      let type = 'any';

      if (prop.type) {
        type = prop.type as string;

        if (typeof prop.type === 'function') {
          type = prop.type.name;
        }
      }

      member.type = type.toLowerCase();
      member.mutable = prop.mutable || false;
      member.connect = prop.connect || '-';
      member.context = prop.connect || '-';
      member.watchers = prop.watchCallbacks || [];
    }

    (membersMap[category] as any).push(member);

    return membersMap;
  }, {
      props: [],
      states: [],
      elements: [],
      methods: []
    });
}


function getComponentMeta(plt: d.PlatformApi, tagName: string): Promise<d.DevInspectorComponentMeta> {
  const elm = { nodeName: tagName } as any;
  const internalMeta = plt.getComponentMeta(elm);

  if (!internalMeta || !internalMeta.componentConstructor) {
    return Promise.resolve(null);
  }

  const cmpCtr = internalMeta.componentConstructor;

  const members = getMembersMeta(cmpCtr.properties || {});

  const listeners = (internalMeta.listenersMeta || []).map(listenerMeta => {
    return {
      event: listenerMeta.eventName,
      capture: listenerMeta.eventCapture,
      disabled: listenerMeta.eventDisabled,
      passive: listenerMeta.eventPassive,
      method: listenerMeta.eventMethodName
    };
  });

  const emmiters = cmpCtr.events || [];

  const meta: d.DevInspectorComponentMeta = {
    tag: cmpCtr.is,
    bundle: (internalMeta.bundleIds || 'unknown') as d.BundleIds,
    encapsulation: cmpCtr.encapsulation || 'none',
    ...members,
    events: {
      emmiters,
      listeners
    }
  };

  return Promise.resolve(meta);
}

function getComponentInstance(plt: d.PlatformApi, elm: any) {
  return Promise.resolve(plt.instanceMap.get(elm));
}
