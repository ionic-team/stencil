
/**
 * Externs are used so these properties are not
 * mistakenly renamed. When two JS files are compiled at different
 * times, there are cerain properties that need to NOT be renamed so
 * each JS file can communicate against the known property names.
 *
 * https://developers.google.com/closure/compiler/docs/api-tutorial3
 */


/**
 * Global Ionic
 * Each binding can provide it's own values to window.Ionic
 */
function configCtrl(){};
function loadComponents(){};
function components(){};
function staticDir(){};
function domCtrl(){};
function read(){};
function write(){};
function nextTickCtrl(){};
function nextTick(){};


/**
 * Injected Ionic
 * Passed into user's closure
 */
function Ionic(){};
function controllers(){};
function emit(){};
function listen(){};
function theme(){};


/**
 * Config API
 * Each binding provides its own Config
 */
function get(){};
function getBoolean(){};
function getNumber(){};


/**
 * Proxy Element
 */
function $el(){};
function $meta(){};
function listeners(){};


/**
 * Component Instance
 */
function ionViewDidLoad(){};
function ionViewWillUnload(){};
function render(){};


/**
 * Renderer data properties
 */
function attrs(){};
function on(){};
function props(){};


/**
 * Web Standards
 * Stuff closure doesn't know to not rename yet
 */
function connectedCallback(){};
function attributeChangedCallback(){};
function disconnectedCallback(){};
function observedAttributes(){};
function customElements(){};
function define(){};
function attachShadow(){};


/**
 * Polyfills
 */
function ShadyDOM(){};
function inUse(){};
