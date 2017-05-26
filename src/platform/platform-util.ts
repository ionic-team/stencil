import { PlatformConfig } from '../util/interfaces';


export function detectPlatforms(url: string, userAgent: string, platforms: PlatformConfig[], defaultPlatform: string) {
  // bracket notation to ensure they're not property renamed
  let validPlatforms = platforms.filter(p => p['isMatch'] && p['isMatch'](url, userAgent));

  if (!validPlatforms.length) {
    validPlatforms = platforms.filter(p => p['name'] === defaultPlatform);
  }

  return validPlatforms;
}


export function isPlatformMatch(url: string, userAgent: string, platformName: string, userAgentAtLeastHas: string[], userAgentMustNotHave: string[]) {
  const queryValue = queryParam(url, 'ionicplatform');
  if (queryValue) {
    return queryValue === platformName;
  }

  if (userAgent) {
    userAgent = userAgent.toLowerCase();

    for (var i = 0; i < userAgentAtLeastHas.length; i++) {
      if (userAgent.indexOf(userAgentAtLeastHas[i]) > -1) {
        for (var j = 0; j < userAgentMustNotHave.length; j++) {
          if (userAgent.indexOf(userAgentMustNotHave[j]) > -1) {
            return false;
          }
        }
        return true;
      }
    }
  }

  return false;
}


function queryParam(url: string, key: string) {
  key = key.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + key + '=([^&#]*)');
  var results = regex.exec(url);
  return results ? decodeURIComponent(results[1].replace(/\+/g, ' ')) : null;
}
