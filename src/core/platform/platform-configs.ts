import { isPlatformMatch } from './platform-util';
import { PlatformConfig } from '../../util/interfaces';


// order from most specifc to least specific
export const PLATFORM_CONFIGS: PlatformConfig[] = [

  {
    'name': 'ipad',
    'isMatch': (url, userAgent) => isPlatformMatch(url, userAgent, 'ipad', ['ipad'], ['windows phone'])
  },

  {
    'name': 'iphone',
    'isMatch': (url, userAgent) => isPlatformMatch(url, userAgent, 'iphone', ['iphone'], ['windows phone'])
  },

  {
    'name': 'ios',
    'settings': {
      'mode': 'ios',
    },
    'isMatch': (url, userAgent) => isPlatformMatch(url, userAgent, 'ios', ['iphone', 'ipad', 'ipod'], ['windows phone'])
  },

  {
    'name': 'android',
    'settings': {
      'activator': 'ripple',
      'mode': 'md',
    },
    'isMatch': (url, userAgent) => isPlatformMatch(url, userAgent, 'android', ['android', 'silk'], ['windows phone'])
  },

  {
    'name': 'windows',
    'settings': {
      'mode': 'wp'
    },
    'isMatch': (url, userAgent) => isPlatformMatch(url, userAgent, 'windows', ['windows phone'], [])
  },

  {
    'name': 'core',
    'settings': {
      'mode': 'md'
    }
  },

];
