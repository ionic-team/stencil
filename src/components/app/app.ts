import { IonElement, h, VNode } from '../../element/ion-element';


export class IonApp extends IonElement {

  render(): VNode {
    return h('.app');
  }

}

IonApp.prototype['$css'] = `


/* Normalize */
/* -------------------------------------------------- */
/* ! normalize.css v3.0.2 | MIT License | github.com/necolas/normalize.css */


/* HTML5 display definitions */
/* ------------------------ */

/* 1. Normalize vertical alignment of "progress" in Chrome, Firefox, and Opera. */
audio,
canvas,
progress,
video {
  vertical-align: baseline; /* 1 */
}

/* Prevent modern browsers from displaying "audio" without controls. */
/* Remove excess height in iOS 5 devices. */
audio:not([controls]) {
  display: none;

  height: 0;
}


/* Text-level semantics */
/* ------------------------ */

/* Address style set to "bolder" in Firefox 4+, Safari, and Chrome. */
b,
strong {
  font-weight: bold;
}


/* Embedded content */
/* ------------------------ */

/* Remove border when inside "a" element in IE 8/9/10. */
img {
  max-width: 100%;

  border: 0;
}

/* Correct overflow not hidden in IE 9/10/11. */
svg:not(:root) {
  overflow: hidden;
}


/* Grouping content */
/* ------------------------ */

/* Address margin not present in IE 8/9 and Safari. */
figure {
  margin: 1em 40px;
}

hr {
  height: 1px;

  border-width: 0;

  box-sizing: content-box;
}

/* Contain overflow in all browsers. */
pre {
  overflow: auto;
}

/* Address odd "em"-unit font size rendering in all browsers. */
code,
kbd,
pre,
samp {
  font-family: monospace, monospace;
  font-size: 1em;
}


/* Forms */
/* ------------------------ */

/* Known limitation: by default, Chrome and Safari on OS X allow very limited */
/* styling of "select", unless a "border" property is set. */

/* 1. Correct color not being inherited. */
/*    Known issue: affects color of disabled elements. */
/* 2. Correct font properties not being inherited. */
/* 3. Address margins set differently in Firefox 4+, Safari, and Chrome. */


label,
input,
select,
textarea {
  font-family: inherit;
  line-height: normal;
}

textarea {
  overflow: auto;

  height: auto;

  font: inherit;
  color: inherit;
}

textarea::placeholder {
  padding-left: 2px;
}

form,
input,
optgroup,
select {
  margin: 0; /* 3 */

  font: inherit; /* 2 */
  color: inherit; /* 1 */
}

/* 1. Avoid the WebKit bug in Android 4.0.* where (2) destroys native "audio" */
/*    and "video" controls. */
/* 2. Correct inability to style clickable "input" types in iOS. */
/* 3. Improve usability and consistency of cursor style between image-type */
/*    "input" and others. */
html input[type="button"], /* 1 */
input[type="reset"],
input[type="submit"] {
  cursor: pointer; /* 3 */

  -webkit-appearance: button; /* 2 */
}

/* remove 300ms delay */
a,
a div,
a span,
a ion-icon,
a ion-label,
button,
button div,
button span,
button ion-icon,
button ion-label,
[tappable],
[tappable] div,
[tappable] span,
[tappable] ion-icon,
[tappable] ion-label,
input,
textarea {
  touch-action: manipulation;
}

a ion-label,
button ion-label {
  pointer-events: none;
}

button {
  border: 0;
  font-family: inherit;
  font-style: inherit;
  font-variant: inherit;
  line-height: 1;
  text-transform: none;
  cursor: pointer;

  -webkit-appearance: button;
}

[tappable] {
  cursor: pointer;
}

/* Re-set default cursor for disabled elements. */
a[disabled],
button[disabled],
html input[disabled] {
  cursor: default;
}

/* Remove inner padding and border in Firefox 4+. */
button::-moz-focus-inner,
input::-moz-focus-inner {
  padding: 0;

  border: 0;
}

/* Firefox's implementation doesn't respect box-sizing, padding, or width. */
/* 1. Address box sizing set to "content-box" in IE 8/9/10. */
/* 2. Remove excess padding in IE 8/9/10. */
input[type="checkbox"],
input[type="radio"] {
  padding: 0; /* 2 */

  box-sizing: border-box; /* 1 */
}

/* Fix the cursor style for Chrome's increment/decrement buttons. For certain */
/* "font-size" values of the "input", it causes the cursor style of the */
/* decrement button to change from "default" to "text". */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  height: auto;
}

/* Remove inner padding and search cancel button in Safari and Chrome on OS X. */
/* Safari (but not Chrome) clips the cancel button when the search input has */
/* padding (and "textfield" appearance). */
input[type="search"]::-webkit-search-cancel-button,
input[type="search"]::-webkit-search-decoration {
  -webkit-appearance: none;
}


/* Tables */
/* ------------------------ */

/* Remove most spacing between table cells. */
table {
  border-collapse: collapse;
  border-spacing: 0;
}

td,
th {
  padding: 0;
}



/* Util */
/* -------------------------------------------------- */

.hide,
[hidden],
template {
  display: none !important;
}

.sticky {
  position: sticky;
  top: 0;
}


/* Focus Outline */
/* -------------------------------------------------- */

:root {
  --focus-outline-border-color:   #51a7e8;
  --focus-outline-border-width:   2px;
  --focus-outline-box-shadow:     0 0 8px 1px var(--focus-outline-border-color);
}


:focus,
:active {
  outline: none;
}

.focus-outline :focus {
  outline: thin dotted;
  outline-offset: -1px;
}

.focus-outline button:focus,
.focus-outline [ion-button]:focus {
  border-color: var(--focus-outline-border-color);
  outline: var(--focus-outline-border-width solid var(--focus-outline-border-color);
  box-shadow: var(--focus-outline-box-shadow;
}

ion-input :focus {
  outline: none;
}


/* Click Block */
/* -------------------------------------------------- */
/* Fill the screen to block clicks (a better pointer-events: none) */
/* to avoid full-page reflows and paints which can cause flickers */

.click-block {
  display: none;
}

.click-block-enabled {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 99999;
  display: block;

  opacity: 0;
  transform: translate3d(0, -100%, 0) translateY(1px);

  /* background: red;
  /* opacity: .3;
  contain: strict;
}

.click-block-active {
  transform: translate3d(0, 0, 0);
}



/* App */
/* -------------------------------------------------- */
/* All font sizes use rem units */
/* By default, 1rem equals 10px. For example, 1.4rem  === 14px */
/* font-size-root value, which is on the <html> element */
/* is what can scale all fonts */

:root {
  /* @prop - Font size of the root html */
  --font-size-root:               62.5% !default;

  /* @prop - Font weight of all headings */
  --headings-font-weight:         500 !default;

  /* @prop - Line height of all headings */
  --headings-line-height:         1.2 !default;

  /* @prop - Font size of heading level 1 */
  --h1-font-size:                 2.6rem !default;

  /* @prop - Font size of heading level 2 */
  --h2-font-size:                 2.4rem !default;

  /* @prop - Font size of heading level 3 */
  --h3-font-size:                 2.2rem !default;

  /* @prop - Font size of heading level 4 */
  --h4-font-size:                 2rem !default;

  /* @prop - Font size of heading level 5 */
  --h5-font-size:                 1.8rem !default;

  /* @prop - Font size of heading level 6 */
  --h6-font-size:                 1.6rem !default;
}


/* App Structure */
/* -------------------------------------------------- */

* {
  box-sizing: border-box;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
}

html {
  width: 100%;
  height: 100%;

  font-size: var(--font-size-root;

  text-size-adjust: 100%;
}

body {
  position: fixed;
  overflow: hidden;

  margin: 0;
  padding: 0;

  width: 100%;
  max-width: 100%;
  height: 100%;
  max-height: 100%;

  -webkit-font-smoothing: antialiased;
  font-smoothing: antialiased;

  text-rendering: optimizeLegibility;

  -webkit-user-drag: none;

  -ms-content-zooming: none;
  touch-action: manipulation;

  word-wrap: break-word;

  text-size-adjust: none;
  user-select: none;
}


/* App Typography */
/* -------------------------------------------------- */

a {
  background-color: transparent;
}

.enable-hover a:hover {
  opacity: .7;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  margin-top: 1.6rem;
  margin-bottom: 1rem;

  font-weight: $headings-font-weight;
  line-height: $headings-line-height;
}

[padding] {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    &:first-child {
      margin-top: -.3rem;
    }
  }
}

h1 + h2,
h1 + h3,
h2 + h3 {
  margin-top: -.3rem;
}

h1 {
  margin-top: 2rem;

  font-size: $h1-font-size;
}

h2 {
  margin-top: 1.8rem;

  font-size: $h2-font-size;
}

h3 {
  font-size: $h3-font-size;
}

h4 {
  font-size: $h4-font-size;
}

h5 {
  font-size: $h5-font-size;
}

h6 {
  font-size: $h6-font-size;
}

small {
  font-size: 75%;
}

sub,
sup {
  position: relative;

  font-size: 75%;
  line-height: 0;
  vertical-align: baseline;
}

sup {
  top: -.5em;
}

sub {
  bottom: -.25em;
}


/* Nav Container Structure */
/* -------------------------------------------------- */

ion-app,
ion-nav,
ion-tab,
ion-tabs,
.app-root {
  position: absolute;
  top: 0;
  left: 0;
  z-index: $z-index-page-container;
  display: block;

  width: 100%;
  height: 100%;
}

ion-nav,
ion-tab,
ion-tabs {
  overflow: hidden;
}

ion-tab {
  display: none;
}

ion-tab.show-tab {
  display: block;
}

ion-app,
ion-nav,
ion-tab,
ion-tabs,
.app-root,
.ion-page {
  contain: strict;
}


/* Page Container Structure */
/* -------------------------------------------------- */

.ion-page {
  position: absolute;
  top: 0;
  left: 0;
  display: block;

  width: 100%;
  height: 100%;

  /* do not show, but still render so we can get dimensions
  opacity: 0;
}

.ion-page.show-page {
  /* show the page now that it's ready
  opacity: 1;
}


/* Toolbar Container Structure */
/* -------------------------------------------------- */

ion-header {
  position: absolute;
  top: 0;
  left: 0;
  z-index: $z-index-toolbar;
  display: block;

  width: 100%;
}

ion-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: $z-index-toolbar;
  display: block;

  width: 100%;
}


/* Misc */
/* -------------------------------------------------- */

[app-viewport],
[overlay-portal],
[nav-viewport],
[tab-portal],
.nav-decor {
  display: none;
}


/* Text Alignment */
/* -------------------------------------------------- */

[text-left] {
  text-align: left;
}

[text-center] {
  text-align: center;
}

[text-right] {
  text-align: right;
}

[text-justify] {
  text-align: justify;
}

[text-nowrap] {
  white-space: nowrap;
}

[text-wrap] {
  white-space: normal;
}


/* Text Transformation */
/* -------------------------------------------------- */

[text-uppercase] {
  text-transform: uppercase;
}

[text-lowercase] {
  text-transform: lowercase;
}

[text-capitalize] {
  text-transform: capitalize;
}


/* iOS App */
/* -------------------------------------------------- */

ion-app.ios {
  font-family: var(--font-family-ios-base;
  font-size: var(--font-size-ios-base;
  background-color: $background-ios-color;
}


/* Material Design App */
/* -------------------------------------------------- */

ion-app.md {
  font-family: var(--font-family-md-base;
  font-size: var(--font-size-md-base;
  background-color: $background-md-color;
}


/* Windows App */
/* -------------------------------------------------- */

ion-app.wp {
  font-family: var(--font-family-wp-base;
  font-size: var(--font-size-wp-base;
  background-color: $background-wp-color;
}

`;
