import { CompilerCtx, Config, EntryModule, HostConfig, HostRule, HostRuleHeader, HydrateComponent, HydrateResults, ServiceWorkerConfig } from '../../declarations';
import { DEFAULT_STYLE_MODE } from '../../util/constants';
import { getAppWWWBuildDir, getBundleFilename } from '../app/app-file-naming';
import { pathJoin } from '../util';


export async function generateHostConfig(config: Config, ctx: CompilerCtx, entryModules: EntryModule[], hydrateResultss: HydrateResults[]) {
  const hostConfig: HostConfig = {
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
    const hostRule = generateHostRule(config, ctx, entryModules, hydrateResults);
    if (hostRule) {
      hostConfig.hosting.rules.push(hostRule);
    }
  });

  addDefaults(config, hostConfig);

  const hostConfigFilePath = pathJoin(config, config.wwwDir, HOST_CONFIG_FILENAME);

  await mergeUserHostConfigFile(config, ctx, hostConfig);

  await ctx.fs.writeFile(hostConfigFilePath, JSON.stringify(hostConfig, null, 2));
}


export function generateHostRule(config: Config, ctx: CompilerCtx, entryModules: EntryModule[], hydrateResults: HydrateResults) {
  const hostRule: HostRule = {
    include: hydrateResults.path,
    headers: generateHostRuleHeaders(config, ctx, entryModules, hydrateResults)
  };

  if (hostRule.headers.length === 0) {
    return null;
  }

  return hostRule;
}


export function generateHostRuleHeaders(config: Config, ctx: CompilerCtx, entryModules: EntryModule[], hydrateResults: HydrateResults) {
  const hostRuleHeaders: HostRuleHeader[] = [];

  addStyles(config, hostRuleHeaders, hydrateResults);
  addCoreJs(config, ctx.appCoreWWWPath, hostRuleHeaders);
  addBundles(config, entryModules, hostRuleHeaders, hydrateResults.components);
  addScripts(config, hostRuleHeaders, hydrateResults);
  addImgs(config, hostRuleHeaders, hydrateResults);

  return hostRuleHeaders;
}


function addCoreJs(config: Config, appCoreWWWPath: string, hostRuleHeaders: HostRuleHeader[]) {
  const relPath = pathJoin(config, '/', config.sys.path.relative(config.wwwDir, appCoreWWWPath));

  hostRuleHeaders.push(formatLinkRelPreloadHeader(relPath));
}


export function addBundles(config: Config, entryModules: EntryModule[], hostRuleHeaders: HostRuleHeader[], components: HydrateComponent[]) {
  components = sortComponents(components);

  const bundleIds = getBundleIds(entryModules, components);

  bundleIds.forEach(bundleId => {
    if (hostRuleHeaders.length < MAX_LINK_REL_PRELOAD_COUNT) {
      const bundleUrl = getBundleUrl(config, bundleId);

      hostRuleHeaders.push(formatLinkRelPreloadHeader(bundleUrl));
    }
  });
}


export function getBundleIds(entryModules: EntryModule[], components: HydrateComponent[]) {
  const bundleIds: string[] = [];

  components.forEach(cmp => {
    entryModules.forEach(mb => {
      const moduleFile = mb.moduleFiles.find(mf => mf.cmpMeta && mf.cmpMeta.tagNameMeta === cmp.tag);
      if (!moduleFile) {
        return;
      }

      let bundleId: string;
      if (typeof moduleFile.cmpMeta.bundleIds === 'string') {
        bundleId = moduleFile.cmpMeta.bundleIds;
      } else {

        bundleId = moduleFile.cmpMeta.bundleIds[DEFAULT_MODE];
        if (!bundleId) {
          bundleId = moduleFile.cmpMeta.bundleIds[DEFAULT_STYLE_MODE];
        }
      }

      if (bundleId && bundleIds.indexOf(bundleId) === -1) {
        bundleIds.push(bundleId);
      }
    });
  });

  return bundleIds;
}


function getBundleUrl(config: Config, bundleId: string) {
  const unscopedFileName = getBundleFilename(bundleId, false);
  const unscopedWwwBuildPath = pathJoin(config, getAppWWWBuildDir(config), unscopedFileName);
  return pathJoin(config, '/', config.sys.path.relative(config.wwwDir, unscopedWwwBuildPath));
}


export function sortComponents(components: HydrateComponent[]) {
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


function addStyles(config: Config, hostRuleHeaders: HostRuleHeader[], hydrateResults: HydrateResults) {
  hydrateResults.styleUrls.forEach(styleUrl => {
    if (hostRuleHeaders.length >= MAX_LINK_REL_PRELOAD_COUNT) {
      return;
    }

    const url = config.sys.url.parse(styleUrl);
    if (url.hostname === hydrateResults.hostname) {
      hostRuleHeaders.push(formatLinkRelPreloadHeader(url.path));
    }
  });
}


function addScripts(config: Config, hostRuleHeaders: HostRuleHeader[], hydrateResults: HydrateResults) {
  hydrateResults.scriptUrls.forEach(scriptUrl => {
    if (hostRuleHeaders.length >= MAX_LINK_REL_PRELOAD_COUNT) {
      return;
    }

    const url = config.sys.url.parse(scriptUrl);
    if (url.hostname === hydrateResults.hostname) {
      hostRuleHeaders.push(formatLinkRelPreloadHeader(url.path));
    }
  });
}


function addImgs(config: Config, hostRuleHeaders: HostRuleHeader[], hydrateResults: HydrateResults) {
  hydrateResults.imgUrls.forEach(imgUrl => {
    if (hostRuleHeaders.length >= MAX_LINK_REL_PRELOAD_COUNT) {
      return;
    }

    const url = config.sys.url.parse(imgUrl);
    if (url.hostname === hydrateResults.hostname) {
      hostRuleHeaders.push(formatLinkRelPreloadHeader(url.path));
    }
  });
}


export function formatLinkRelPreloadHeader(url: string) {
  const header: HostRuleHeader = {
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


function addDefaults(config: Config, hostConfig: HostConfig) {
  addBuildDirCacheControl(config, hostConfig);
  addServiceWorkerNoCacheControl(config, hostConfig);
}


function addBuildDirCacheControl(config: Config, hostConfig: HostConfig) {
  const relPath = pathJoin(config, '/', config.sys.path.relative(config.wwwDir, getAppWWWBuildDir(config)), '**');

  hostConfig.hosting.rules.push({
    include: relPath,
    headers: [
      {
        name: `Cache-Control`,
        value: `public, max-age=31536000`
      }
    ]
  });
}


function addServiceWorkerNoCacheControl(config: Config, hostConfig: HostConfig) {
  if (!config.serviceWorker) {
    return;
  }
  const swConfig = config.serviceWorker as ServiceWorkerConfig;

  const relPath = pathJoin(config, '/', config.sys.path.relative(config.wwwDir, swConfig.swDest));

  hostConfig.hosting.rules.push({
    include: relPath,
    headers: [
      {
        name: `Cache-Control`,
        value: `no-cache, no-store, must-revalidate`
      }
    ]
  });
}


async function mergeUserHostConfigFile(config: Config, ctx: CompilerCtx, hostConfig: HostConfig) {
  const hostConfigFilePath = pathJoin(config, config.srcDir, HOST_CONFIG_FILENAME);
  try {
    const userHostConfigStr = await ctx.fs.readFile(hostConfigFilePath);

    const userHostConfig = JSON.parse(userHostConfigStr) as HostConfig;

    mergeUserHostConfig(userHostConfig, hostConfig);

  } catch (e) {}
}


export function mergeUserHostConfig(userHostConfig: HostConfig, hostConfig: HostConfig) {
  if (!userHostConfig || !userHostConfig.hosting) {
    return;
  }

  if (!Array.isArray(userHostConfig.hosting.rules)) {
    return;
  }

  const rules = userHostConfig.hosting.rules.concat(hostConfig.hosting.rules);

  hostConfig.hosting.rules = rules;
}


const DEFAULT_MODE = 'md';
const MAX_LINK_REL_PRELOAD_COUNT = 6;
const HOST_CONFIG_FILENAME = 'host.config.json';

const IMG_EXTS = ['png', 'gif', 'svg', 'jpg', 'jpeg', 'webp'];
const STYLE_EXT = 'css';
const SCRIPT_EXT = 'js';
