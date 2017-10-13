
/**
 * Externs are used so these properties are not mistakenly
 * renamed. When two JS files are compiled at different times,
 * there are cerain properties that need to NOT be renamed so
 * each JS file can communicate against the known property names.
 *
 * https://developers.google.com/closure/compiler/docs/api-tutorial3
 */

/**
 * Core Global
 * Internal core singleton injected into app and component's scope
 */
function addListener(){};
function attr(){};
function dom(){};
function emit(){};
function enableListener(){};
function eventNameFn(){};
function isClient(){};
function isPrerender(){};
function isServer(){};
function mode(){};
function raf(){};
function read(){};
function write(){};
function $definedComponents(){};


/**
 * App Global - window.App
 * Properties which get added to the app's global
 */
function components(){};
function loadComponents(){};
function loadStyles(){};


/**
 * Host Element
 * Properties set on the host element
 */
function $activeLoading(){};
function $connected(){};
function $defaultHolder(){};
function $initLoad(){};
function $instance(){};
function $rendered(){};
function $onRender(){};
function $(){};
function componentOnReady() {};
function listeners(){};


/**
 * Component Instance
 * Methods set on the user's component
 */
function componentWillLoad(){};
function componentDidLoad(){};
function componentWillUpdate(){};
function componentDidUpdate(){};
function componentDidUnload(){};
function hostData(){};
function render(){};


/**
 * Renderer data properties
 * Properties used by the renderer and user's hyperscript
 */
function attrs(){};
function on(){};
function props(){};


/**
 * Compiled hyperscript props
 * Already short, just don't rename them
 */
function a(){};
function c(){};
function e(){};
function h(){};
function k(){};
function l(){};
function m(){};
function n(){};
function o(){};
function p(){};
function s(){};
function t(){};


/**
 * Web Standards
 * Window and document stuff closure doesn't know not to rename
 */
function attachShadow(){};
function attributeChangedCallback(){};
function composed(){};
function connectedCallback(){};
function content(){};
function customElements(){};
function define(){};
function didTimeout(){};
function disconnectedCallback() {};
function fetch(){};
function getRootNode(){};
function host(){};
function now(){};
function observedAttributes(){};
function passive(){};
function performance(){};
function requestIdleCallback(){};
function shadowRoot(){};
function timeRemaining(){};
