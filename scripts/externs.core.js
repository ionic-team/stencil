
/**
 * Externs are used so these properties are not
 * mistakenly renamed. When two JS files are compiled at different
 * times, there are cerain properties that need to NOT be renamed so
 * each JS file can communicate against the known property names.
 *
 * https://developers.google.com/closure/compiler/docs/api-tutorial3
 */


/**
 * Global window.Ionic
 * Each binding can provide it's own values to window.Ionic
 */
function components(){};
function ConfigCtrl(){};
function dom(){};
function DomCtrl(){};
function eventNameFn(){};
function loadComponents(){};
function nextTick(){};
function NextTickCtrl(){};
function raf(){};
function read(){};
function staticDir(){};
function write(){};
function Animation(){};


/**
 * Injected Ionic
 * Passed into user's closure so it's globally available
 * to all of the user's code.
 */
function Ionic(){};
function config(){};
function controllers(){};
function create(){};
function dismiss(){};
function emit(){};
function listen(){};
function modal(){};
function present(){};
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
 * Properties set on the proxy element
 */
function $el(){};
function $meta(){};
function listeners(){};


/**
 * Component Instance
 * Methods set on the user's component
 */
function ionViewDidLoad(){};
function ionViewWillUnload(){};
function render(){};


/**
 * Renderer data properties
 * Properties used by the renderer and user's hyperscript
 */
function attrs(){};
function on(){};
function props(){};


/**
 * Web Standards
 * Window and document stuff closure doesn't know not to rename yet
 */
function attachShadow(){};
function attributeChangedCallback(){};
function connectedCallback(){};
function customElements(){};
function host(){};
function define(){};
function disconnectedCallback(){};
function observedAttributes(){};
function requestIdleCallback(){};
function timeRemaining(){};
function shadowRoot(){};


/**
 * Polyfills
 */
function ShadyDOM(){};
function inUse(){};
