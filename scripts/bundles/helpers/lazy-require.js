function _lazyRequire(moduleId) {
  return new Proxy(
    {},
    {
      get(_target, propertyKey) {
        const importedModule = require(moduleId);
        return Reflect.get(importedModule, propertyKey);
      },
      set(_target, propertyKey, value) {
        const importedModule = require(moduleId);
        return Reflect.set(importedModule, propertyKey, value);
      },
    }
  );
}
