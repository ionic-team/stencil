import * as d from '../../declarations';
import { URL } from 'url';


export async function generateHostConfig(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetWww, entryModules: d.EntryModule[], hydrateResultss: d.HydrateResults[]) {
  const hostConfig: d.HostConfig = {
    hosting: {
      rules: []
    }
  };

  hydrateResultss = hydrateResultss.sort((a, b) => {
    if (a.url.toLowerCase() < b.url.toLowerCase()) return -1;
    if (a.url.toLowerCase() > b.url.toLowerCase()) return 1;
    return 0;
  });

  hydrateResultss.forEach(hydrateResults => {
    const hostRule = generateHostRule(config, outputTarget, entryModules, hydrateResults);
    if (hostRule) {
      hostConfig.hosting.rules.push(hostRule);
    }
  });

  addDefaults(config, outputTarget, hostConfig);

  const hostConfigFilePath = config.sys.path.join(outputTarget.appDir, HOST_CONFIG_FILENAME);

  await mergeUserHostConfigFile(config, compilerCtx, hostConfig);

  await compilerCtx.fs.writeFile(hostConfigFilePath, JSON.stringify(hostConfig, null, 2));
}


export function generateHostRule(config: d.Config, outputTarget: d.OutputTargetWww, entryModules: d.EntryModule[], hydrateResults: d.HydrateResults) {
  const hostRule: d.HostRule = {
    include: hydrateResults.pathname,
    headers: generateHostRuleHeaders(config, outputTarget, entryModules, hydrateResults)
  };

  if (hostRule.headers.length === 0) {
    return null;
  }

  return hostRule;
}


export function generateHostRuleHeaders(config: d.Config, outputTarget: d.OutputTargetWww, entryModules: d.EntryModule[], hydrateResults: d.HydrateResults) {
  const hostRuleHeaders: d.HostRuleHeader[] = [];

  addStyles(hostRuleHeaders, hydrateResults);
  addCoreJs(config, outputTarget, 'compilerCtx.appCoreWWWPath', hostRuleHeaders);
  addBundles(config, outputTarget, entryModules, hostRuleHeaders, hydrateResults.components);
  addScripts(hostRuleHeaders, hydrateResults);
  addImgs(hostRuleHeaders, hydrateResults);

  return hostRuleHeaders;
}


function addCoreJs(config: d.Config, outputTarget: d.OutputTargetWww, appCoreWWWPath: string, hostRuleHeaders: d.HostRuleHeader[]) {
  const url = getUrlFromFilePath(config, outputTarget, appCoreWWWPath);

  hostRuleHeaders.push(formatLinkRelPreloadHeader(url));
}


export function addBundles(config: d.Config, outputTarget: d.OutputTargetWww, entryModules: d.EntryModule[], hostRuleHeaders: d.HostRuleHeader[], components: d.HydrateComponent[]) {
  components = sortComponents(components);

  const bundleIds = getBundleIds(entryModules, components);

  bundleIds.forEach(bundleId => {
    if (hostRuleHeaders.length < MAX_LINK_REL_PRELOAD_COUNT) {
      const bundleUrl = getBundleUrl(config, outputTarget, bundleId);

      hostRuleHeaders.push(formatLinkRelPreloadHeader(bundleUrl));
    }
  });
}


export function getBundleIds(_entryModules: d.EntryModule[], _components: d.HydrateComponent[]) {
  const bundleIds: string[] = [];

  // components.forEach(cmp => {
  //   entryModules.forEach(mb => {
  //     const moduleFile = mb.moduleFiles.find(mf => mf.cmpCompilerMeta && mf.cmpCompilerMeta.tagName === cmp.tag);
  //     if (!moduleFile) {
  //       return;
  //     }

  //     let bundleId: string;
  //     if (typeof moduleFile.cmpCompilerMeta.bundleIds === 'string') {
  //       bundleId = moduleFile.cmpCompilerMeta.bundleIds;
  //     } else {

  //       bundleId = (moduleFile.cmpCompilerMeta.bundleIds as d.BundleIds)[DEFAULT_MODE];
  //       if (!bundleId) {
  //         bundleId = (moduleFile.cmpCompilerMeta.bundleIds as d.BundleIds)[DEFAULT_STYLE_MODE];
  //       }
  //     }

  //     if (bundleId && bundleIds.indexOf(bundleId) === -1) {
  //       bundleIds.push(bundleId);
  //     }
  //   });
  // });

  return bundleIds;
}


function getBundleUrl(config: d.Config, outputTarget: d.OutputTargetWww, _bundleId: string) {
  // const unscopedFileName = 'getBrowserFilename(bundleId, false)';
  const unscopedWwwBuildPath = 'sys.path.join(getAppBuildDir(config, outputTarget), unscopedFileName)';
  return getUrlFromFilePath(config, outputTarget, unscopedWwwBuildPath);
}


export function getUrlFromFilePath(config: d.Config, outputTarget: d.OutputTargetWww, filePath: string) {
  let url = config.sys.path.join('/', config.sys.path.relative(outputTarget.appDir, filePath));

  url = outputTarget.baseUrl + url.substring(1);

  return url;
}


export function sortComponents(components: d.HydrateComponent[]) {
  return components.sort((a, b) => {
    if (a.depth > b.depth) return -1;
    if (a.depth < b.depth) return 1;
    if (a.count > b.count) return -1;
    if (a.count < b.count) return 1;
    if (a.tag < b.tag) return -1;
    if (a.tag > b.tag) return 1;
    return 0;
  });
}


function addStyles(hostRuleHeaders: d.HostRuleHeader[], hydrateResults: d.HydrateResults) {
  hydrateResults.styles.forEach(style => {
    if (hostRuleHeaders.length >= MAX_LINK_REL_PRELOAD_COUNT) {
      return;
    }

    const url = new URL(style.href);
    if (url.hostname === hydrateResults.hostname) {
      hostRuleHeaders.push(formatLinkRelPreloadHeader(url.pathname));
    }
  });
}


function addScripts(hostRuleHeaders: d.HostRuleHeader[], hydrateResults: d.HydrateResults) {
  hydrateResults.scripts.forEach(script => {
    if (hostRuleHeaders.length >= MAX_LINK_REL_PRELOAD_COUNT) {
      return;
    }

    const url = new URL(script.src);
    if (url.hostname === hydrateResults.hostname) {
      hostRuleHeaders.push(formatLinkRelPreloadHeader(url.pathname));
    }
  });
}


function addImgs(hostRuleHeaders: d.HostRuleHeader[], hydrateResults: d.HydrateResults) {
  hydrateResults.imgs.forEach(img => {
    if (hostRuleHeaders.length >= MAX_LINK_REL_PRELOAD_COUNT) {
      return;
    }

    const url = new URL(img.src);
    if (url.hostname === hydrateResults.hostname) {
      hostRuleHeaders.push(formatLinkRelPreloadHeader(url.pathname));
    }
  });
}


export function formatLinkRelPreloadHeader(url: string) {
  const header: d.HostRuleHeader = {
    name: 'Link',
    value: formatLinkRelPreloadValue(url)
  };
  return header;
}


function formatLinkRelPreloadValue(url: string) {
  const parts = [
    `<${url}>`,
    `rel=preload`
  ];

  const ext = url.split('.').pop().toLowerCase();
  if (ext === SCRIPT_EXT) {
    parts.push(`as=script`);

  } else if (ext === STYLE_EXT) {
    parts.push(`as=style`);

  } else if (IMG_EXTS.indexOf(ext) > -1) {
    parts.push(`as=image`);
  }

  return parts.join(';');
}


function addDefaults(config: d.Config, outputTarget: d.OutputTargetWww, hostConfig: d.HostConfig) {
  addBuildDirCacheControl(config, outputTarget, hostConfig);
  addServiceWorkerNoCacheControl(config, outputTarget, hostConfig);
}


function addBuildDirCacheControl(config: d.Config, outputTarget: d.OutputTargetWww, hostConfig: d.HostConfig) {
  const url = getUrlFromFilePath(config, outputTarget, 'getAppBuildDir(config, outputTarget)');

  hostConfig.hosting.rules.push({
    include: config.sys.path.join(url, '**'),
    headers: [
      {
        name: `Cache-Control`,
        value: `public, max-age=31536000`
      }
    ]
  });
}


function addServiceWorkerNoCacheControl(config: d.Config, outputTarget: d.OutputTargetWww, hostConfig: d.HostConfig) {
  if (!outputTarget.serviceWorker) {
    return;
  }

  const url = getUrlFromFilePath(config, outputTarget, outputTarget.serviceWorker.swDest);

  hostConfig.hosting.rules.push({
    include: url,
    headers: [
      {
        name: `Cache-Control`,
        value: `no-cache, no-store, must-revalidate`
      }
    ]
  });
}


async function mergeUserHostConfigFile(config: d.Config, compilerCtx: d.CompilerCtx, hostConfig: d.HostConfig) {
  const hostConfigFilePath = config.sys.path.join(config.srcDir, HOST_CONFIG_FILENAME);
  try {
    const userHostConfigStr = await compilerCtx.fs.readFile(hostConfigFilePath);

    const userHostConfig = JSON.parse(userHostConfigStr) as d.HostConfig;

    mergeUserHostConfig(userHostConfig, hostConfig);

  } catch (e) {}
}


export function mergeUserHostConfig(userHostConfig: d.HostConfig, hostConfig: d.HostConfig) {
  if (!userHostConfig || !userHostConfig.hosting) {
    return;
  }

  if (!Array.isArray(userHostConfig.hosting.rules)) {
    return;
  }

  const rules = userHostConfig.hosting.rules.concat(hostConfig.hosting.rules);

  hostConfig.hosting.rules = rules;
}


export const DEFAULT_MODE = 'md';
const MAX_LINK_REL_PRELOAD_COUNT = 6;
export const HOST_CONFIG_FILENAME = 'host.config.json';

const IMG_EXTS = ['png', 'gif', 'svg', 'jpg', 'jpeg', 'webp'];
const STYLE_EXT = 'css';
const SCRIPT_EXT = 'js';
