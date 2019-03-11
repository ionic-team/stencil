import * as d from '../../declarations';


/**
 * DEPRECATED "config.collections" since 0.6.0, 2018-02-13
 */
export function _deprecatedValidateConfigCollections(config: d.Config) {
  if (!Array.isArray((config as any).collections)) {
    return;
  }

  const deprecatedCollections: { name: string }[] = (config as any).collections;

  if (deprecatedCollections.length > 0) {
    const errorMsg = [
      `As of v0.6.0, "config.collections" has been deprecated in favor of standard ES module imports. `,
      `Instead of listing collections within the stencil config, collections should now be `,
      `imported by the app's root component or module. The benefit of this is to not only simplify `,
      `the config by using a standards approach for imports, but to also automatically import the `,
      `collection's types to improve development. Please remove "config.collections" `,
      `from the "stencil.config.js" file, and add `,
      deprecatedCollections.length === 1 ? `this import ` : `these imports `,
      `to your root component or root module:  `
    ];

    deprecatedCollections.forEach(collection => {
      errorMsg.push(`import '${collection.name}';  `);
    });

    config.logger.error(errorMsg.join(''));
  }
}
