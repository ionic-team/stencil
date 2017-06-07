import { isPlatformMatch } from './platform-util';
import { PlatformConfig } from '../../util/interfaces';


const IPAD = 'ipad';
const IPHONE = 'iphone';
const WINDOWS_PHONE = 'windows phone';

// order from most specifc to least specific
export const PLATFORM_CONFIGS: PlatformConfig[] = [

  {
    'name': IPAD,
    'settings': {
      'keyboardHeight': 500,
    },
    'isMatch': function(url, userAgent) {
      return isPlatformMatch(url, userAgent, IPAD, [IPAD], [WINDOWS_PHONE]);
    }
  },

  {
    'name': IPHONE,
    'isMatch': function(url, userAgent) {
      return isPlatformMatch(url, userAgent, IPHONE, [IPHONE], [WINDOWS_PHONE]);
    }
  },

  {
    'name': 'ios',
    'settings': {
      'autoFocusAssist': 'delay',
      'hoverCSS': false,
      'inputBlurring': true,
      'inputCloning': true,
      'keyboardHeight': 300,
      'mode': 'ios',
      'scrollAssist': true,
      'statusbarPadding': false,
      'swipeBackEnabled': true,
      'tapPolyfill': false,
      'virtualScrollEventAssist': false,
      'disableScrollAssist': true,
    },
    'isMatch': function(url, userAgent) {
      return isPlatformMatch(url, userAgent, 'ios', [IPHONE, IPAD, 'ipod'], [WINDOWS_PHONE]);
    }
  },

  {
    'name': 'android',
    'settings': {
      'activator': 'ripple',
      'autoFocusAssist': 'immediate',
      'inputCloning': true,
      'scrollAssist': true,
      'hoverCSS': false,
      'keyboardHeight': 300,
      'mode': 'md',
    },
    'isMatch': function(url, userAgent) {
      return isPlatformMatch(url, userAgent, 'android', ['android', 'silk'], [WINDOWS_PHONE]);
    }
  },

  {
    'name': 'windows',
    'settings': {
      'mode': 'wp',
      'autoFocusAssist': 'immediate',
      'hoverCSS': false
    },
    'isMatch': function(url, userAgent) {
      return isPlatformMatch(url, userAgent, 'windows', [WINDOWS_PHONE], []);
    }
  },

  {
    'name': 'core',
    'settings': {
      'mode': 'md',
      'keyboardHeight': 290
    }
  },

];
