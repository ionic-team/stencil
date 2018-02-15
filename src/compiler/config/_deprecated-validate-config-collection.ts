import { Config, ConfigCollection } from '../../declarations';


/**
 * DEPRECATED "config.collections" since 0.6.0, 2018-02-13
 */
export function _deprecatedValidateConfigCollections(config: Config) {
  if (Array.isArray((config as any).collections)) {
    config._deprecatedCollections = (config as any).collections;
  } else {
    config._deprecatedCollections = [];
  }

  config._deprecatedCollections = config._deprecatedCollections.map(_deprecatedValidateConfigCollection);

  if (config._deprecatedCollections.length > 0) {
    const warningMsg = [
      `As of v0.6.0, "config.collections" has been deprecated in favor of standard ES module imports. `,
      `Instead of listing collections within the stencil config, collections should now be `,
      `imported by the app's root component or module. The benefit of this is to not only simplify `,
      `the config by using a standards approach for imports, but to also automatically import the `,
      `collection's types to improve development. Please remove "config.collections" `,
      `from the "stencil.config.js" file, and add `,
      config._deprecatedCollections.length === 1 ? `this import ` : `these imports `,
      `to your root component or root module:  `
    ];

    config._deprecatedCollections.forEach(collection => {
      warningMsg.push(`import '${collection.name}';  `);
    });

    config.logger.warn(warningMsg.join(''));
  }
}


export function _deprecatedValidateConfigCollection(userInput: any) {
  if (!userInput || Array.isArray(userInput) || typeof userInput === 'number' || typeof userInput === 'boolean') {
    throw new Error(`invalid collection: ${userInput}`);
  }

  let configCollection: ConfigCollection;

  if (typeof userInput === 'string') {
    configCollection = {
      name: userInput
    };

  } else {
    configCollection = userInput;
  }

  if (!configCollection.name || typeof configCollection.name !== 'string' || configCollection.name.trim() === '') {
    throw new Error(`missing collection name`);
  }

  configCollection.name = configCollection.name.trim();

  return configCollection;
}
