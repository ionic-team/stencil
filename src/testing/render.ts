import { CompilerCtx, ComponentConstructor, ComponentMeta, ComponentRegistry, Config, HydrateOptions, PlatformApi } from '../declarations';
import { MEMBER_TYPE, PROP_TYPE } from '../util/constants';
import { mockLogger, mockStencilSystem } from './mocks';
import { Renderer } from '../server';
import { validateConfig } from '../compiler/config/validate-config';


const testPlatforms = new WeakMap<Element, PlatformApi>();


export async function render(opts: RenderTestOptions): Promise<any> {
  let rootElm: Element = null;

  try {
    validateRenderOptions(opts);

    const config = getTestBuildConfig();
    const compilerCtx: CompilerCtx = {};
    const registry: ComponentRegistry = {};

    opts.components.forEach((testCmp: ComponentConstructor) => {
      if (testCmp) {
        const cmpMeta: ComponentMeta = {
          tagNameMeta: testCmp.is,
          bundleIds: testCmp.is,
          componentConstructor: testCmp,
          membersMeta: {
            color: { propType: PROP_TYPE.String, memberType: MEMBER_TYPE.Prop }
          }
        };

        if (cmpMeta.componentConstructor.properties) {
          Object.keys(cmpMeta.componentConstructor.properties).forEach(memberName => {
            const constructorProperty = cmpMeta.componentConstructor.properties[memberName];
            const t = constructorProperty.type;

            if (t) {
              cmpMeta.membersMeta[memberName] = {
                propType: t === String ? PROP_TYPE.String : t === Number ? PROP_TYPE.Number : t === Boolean ? PROP_TYPE.Boolean : t === 'Any' ? PROP_TYPE.Any : PROP_TYPE.Unknown,
                memberType: MEMBER_TYPE.Prop
              };
            }
          });
        }

        registry[cmpMeta.tagNameMeta] = cmpMeta;
      }
    });

    const renderer = new Renderer(config, registry, compilerCtx);

    const hydrateOpts: HydrateOptions = {
      html: opts.html,
      serializeHtml: false,
      destroyDom: false,
      isPrerender: false,
      inlineLoaderScript: false,
      inlineStyles: false,
      removeUnusedStyles: false,
      canonicalLink: false,
      collapseWhitespace: false,
      ssrIds: false
    };

    const results = await renderer.hydrate(hydrateOpts);

    if (results.diagnostics.length) {
      const msg = results.diagnostics.map(d => d.messageText).join('\n');
      throw new Error(msg);
    }

    rootElm = (results.root && results.root.children.length > 1 && results.root.children[1].firstElementChild) || null;
    if (rootElm) {
      testPlatforms.set(rootElm, (results as any).__testPlatform);
      delete (results as any).__testPlatform;
    }

  } catch (e) {
    console.error(e);
  }

  return rootElm;
}


export async function flush(root: any) {
  const testPlt = testPlatforms.get(root);

  if (!testPlt) {
    throw new Error(`invalid testing root node`);
  }

  await testPlt.queue.flush();
}


function getTestBuildConfig() {
  const sys = mockStencilSystem();

  const config: Config = {
    sys: sys,
    logger: mockLogger(),
    rootDir: '/',
    suppressTypeScriptErrors: true,
    devMode: true
  };

  config.devMode = true;
  config._isTesting = true;

  return validateConfig(config);
}


function validateRenderOptions(opts: RenderTestOptions) {
  if (!opts) {
    throw new Error('missing render() options');
  }
  if (!opts.components) {
    throw new Error(`missing render() components: ${opts}`);
  }
  if (!Array.isArray(opts.components)) {
    throw new Error(`render() components must be an array: ${opts}`);
  }
  if (typeof opts.html !== 'string') {
    throw new Error(`render() html must be a string: ${opts}`);
  }
}


export interface RenderTestOptions {
  components: any[];
  html: string;
}
