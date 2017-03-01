import { IonElement } from '../../element/base-element';
import { CreateElement, VNode } from '../../utils/interfaces';


export class IonButton extends IonElement {

  ionNode(h: CreateElement): VNode {
    return h('.button', [
      h('span.button-inner', [
        h('slot')
      ]),
      h('div.button-effect')
    ]);
  }

  connectedCallback() {
    this.connect(IonButton.observedAttributes);
  }

  static get observedAttributes() {
    return ['color', 'mode'];
  }

  ionStyles() {
    return `
.button {
  -moz-appearance: none;
  -ms-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  position: relative;
  z-index: 0;
  display: inline-block;
  text-align: center;
  text-overflow: ellipsis;
  text-transform: none;
  white-space: nowrap;
  cursor: pointer;
  vertical-align: top;
  vertical-align: -webkit-baseline-middle;
  transition: background-color, opacity 100ms linear;
  -webkit-font-kerning: none;
  font-kerning: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  contain: content; }

.button-inner {
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-flex-flow: row nowrap;
  -ms-flex-flow: row nowrap;
  flex-flow: row nowrap;
  -webkit-flex-shrink: 0;
  -ms-flex-negative: 0;
  flex-shrink: 0;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  width: 100%;
  height: 100%; }

[ion-button] {
  text-decoration: none; }

a[disabled],
button[disabled],
[ion-button][disabled] {
  cursor: default;
  opacity: .4;
  pointer-events: none; }

.button-block {
  display: block;
  clear: both;
  width: 100%;
  contain: strict; }

.button-block::after {
  clear: both; }

.button-full {
  display: block;
  width: 100%;
  contain: strict; }

.button-full.button-outline {
  border-right-width: 0;
  border-left-width: 0;
  border-radius: 0; }

[icon-left] ion-icon {
  font-size: 1.4em;
  line-height: .67;
  pointer-events: none;
  padding-right: .3em; }

[icon-right] ion-icon {
  font-size: 1.4em;
  line-height: .67;
  pointer-events: none;
  padding-left: .4em; }

.button[icon-only] {
  padding: 0;
  min-width: .9em; }

[icon-only] ion-icon {
  padding: 0 .5em;
  font-size: 1.8em;
  line-height: .67;
  pointer-events: none; }

.button-ios {
  margin: 0.4rem 0.2rem;
  padding: 0 1em;
  height: 2.8em;
  border-radius: 4px;
  font-size: 1.6rem;
  color: #fff;
  background-color: #327eff; }

.button-ios.activated {
  background-color: #2e74eb;
  opacity: 1; }

.button-ios:hover:not(.disable-hover) {
  opacity: 0.8; }

.button-large-ios {
  padding: 0 1em;
  height: 2.8em;
  font-size: 2rem; }

.button-small-ios {
  padding: 0 0.9em;
  height: 2.1em;
  font-size: 1.3rem; }

.button-small-ios[icon-only] ion-icon {
  font-size: 1.3em; }

.button-block-ios {
  margin-right: 0;
  margin-left: 0; }

.button-full-ios {
  margin-right: 0;
  margin-left: 0;
  border-right-width: 0;
  border-left-width: 0;
  border-radius: 0; }

.button-outline-ios {
  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
  border-color: #327eff;
  color: #327eff;
  background-color: transparent; }

.button-outline-ios.activated {
  color: #fff;
  background-color: #327eff;
  opacity: 1; }

.button-clear-ios {
  border-color: transparent;
  color: #327eff;
  background-color: transparent; }

.button-clear-ios.activated {
  background-color: transparent;
  opacity: 0.4; }

.button-clear-ios:hover:not(.disable-hover) {
  color: #327eff;
  opacity: 0.6; }

.button-round-ios {
  padding: 0 2.6rem;
  border-radius: 64px; }

.button-ios-primary {
  color: #fff;
  background-color: #327eff; }

.button-ios-primary.activated {
  background-color: #2e74eb; }

.button-outline-ios-primary {
  border-color: #327eff;
  color: #327eff;
  background-color: transparent; }

.button-outline-ios-primary.activated {
  color: #fff;
  background-color: #327eff; }

.button-clear-ios-primary {
  border-color: transparent;
  color: #327eff;
  background-color: transparent; }

.button-clear-ios-primary.activated {
  opacity: 0.4; }

.button-clear-ios-primary:hover:not(.disable-hover) {
  color: #327eff; }

.button-ios-secondary {
  color: #fff;
  background-color: #32db64; }

.button-ios-secondary.activated {
  background-color: #2ec95c; }

.button-outline-ios-secondary {
  border-color: #32db64;
  color: #32db64;
  background-color: transparent; }

.button-outline-ios-secondary.activated {
  color: #fff;
  background-color: #32db64; }

.button-clear-ios-secondary {
  border-color: transparent;
  color: #32db64;
  background-color: transparent; }

.button-clear-ios-secondary.activated {
  opacity: 0.4; }

.button-clear-ios-secondary:hover:not(.disable-hover) {
  color: #32db64; }

.button-ios-danger {
  color: #fff;
  background-color: #f53d3d; }

.button-ios-danger.activated {
  background-color: #e13838; }

.button-outline-ios-danger {
  border-color: #f53d3d;
  color: #f53d3d;
  background-color: transparent; }

.button-outline-ios-danger.activated {
  color: #fff;
  background-color: #f53d3d; }

.button-clear-ios-danger {
  border-color: transparent;
  color: #f53d3d;
  background-color: transparent; }

.button-clear-ios-danger.activated {
  opacity: 0.4; }

.button-clear-ios-danger:hover:not(.disable-hover) {
  color: #f53d3d; }

.button-ios-light {
  color: #000;
  background-color: #f4f4f4; }

.button-ios-light.activated {
  background-color: #e0e0e0; }

.button-outline-ios-light {
  border-color: #f4f4f4;
  color: #f4f4f4;
  background-color: transparent; }

.button-outline-ios-light.activated {
  color: #000;
  background-color: #f4f4f4; }

.button-clear-ios-light {
  border-color: transparent;
  color: #f4f4f4;
  background-color: transparent; }

.button-clear-ios-light.activated {
  opacity: 0.4; }

.button-clear-ios-light:hover:not(.disable-hover) {
  color: #f4f4f4; }

.button-ios-dark {
  color: #fff;
  background-color: #222; }

.button-ios-dark.activated {
  background-color: #343434; }

.button-outline-ios-dark {
  border-color: #222;
  color: #222;
  background-color: transparent; }

.button-outline-ios-dark.activated {
  color: #fff;
  background-color: #222; }

.button-clear-ios-dark {
  border-color: transparent;
  color: #222;
  background-color: transparent; }

.button-clear-ios-dark.activated {
  opacity: 0.4; }

.button-clear-ios-dark:hover:not(.disable-hover) {
  color: #222; }

.button-strong-ios {
  font-weight: 600; }

.button-md {
  overflow: hidden;
  margin: 0.4rem 0.2rem;
  padding: 0 1.1em;
  height: 3.6rem;
  border-radius: 2px;
  font-size: 1.4rem;
  font-weight: 500;
  text-transform: uppercase;
  color: #fff;
  background-color: #327eff;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
  transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1), background-color 300ms cubic-bezier(0.4, 0, 0.2, 1), color 300ms cubic-bezier(0.4, 0, 0.2, 1); }

.button-md:hover:not(.disable-hover) {
  background-color: #327eff; }

.button-md.activated {
  background-color: #2e74eb;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.14), 0 3px 5px rgba(0, 0, 0, 0.21); }

.button-md .button-effect {
  background-color: #fff; }

.button-large-md {
  padding: 0 1em;
  height: 2.8em;
  font-size: 2rem; }

.button-small-md {
  padding: 0 0.9em;
  height: 2.1em;
  font-size: 1.3rem; }

.button-small-md[icon-only] ion-icon {
  font-size: 1.4em; }

.button-block-md {
  margin-right: 0;
  margin-left: 0; }

.button-full-md {
  margin-right: 0;
  margin-left: 0;
  border-right-width: 0;
  border-left-width: 0;
  border-radius: 0; }

.button-outline-md {
  border-width: 1px;
  border-style: solid;
  border-color: #327eff;
  color: #327eff;
  background-color: transparent;
  box-shadow: none; }

.button-outline-md:hover:not(.disable-hover) {
  background-color: rgba(158, 158, 158, 0.1); }

.button-outline-md.activated {
  background-color: transparent;
  box-shadow: none;
  opacity: 1; }

.button-outline-md .button-effect {
  background-color: #327eff; }

.button-clear-md {
  border-color: transparent;
  color: #327eff;
  background-color: transparent;
  box-shadow: none;
  opacity: 1; }

.button-clear-md.activated {
  background-color: rgba(158, 158, 158, 0.2);
  box-shadow: none; }

.button-clear-md:hover:not(.disable-hover) {
  background-color: rgba(158, 158, 158, 0.1); }

.button-clear-md .button-effect {
  background-color: #999; }

.button-round-md {
  padding: 0 2.6rem;
  border-radius: 64px; }

.button-md [icon-only] {
  padding: 0; }

.button-effect {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  display: none;
  border-radius: 50%;
  background-color: #555;
  opacity: .2;
  -webkit-transform-origin: center center;
  transform-origin: center center;
  transition-timing-function: ease-in-out;
  pointer-events: none; }

.md .button-effect {
  display: block; }

.button-md-primary {
  color: #fff;
  background-color: #327eff; }

.button-md-primary:hover:not(.disable-hover) {
  background-color: #327eff; }

.button-md-primary.activated {
  background-color: #2e74eb;
  opacity: 1; }

.button-md-primary .button-effect {
  background-color: #fff; }

.button-outline-md-primary {
  border-color: #3078f2;
  color: #3078f2;
  background-color: transparent; }

.button-outline-md-primary:hover:not(.disable-hover) {
  background-color: rgba(158, 158, 158, 0.1); }

.button-outline-md-primary.activated {
  background-color: transparent; }

.button-outline-md-primary .button-effect {
  background-color: #3078f2; }

.button-clear-md-primary {
  border-color: transparent;
  color: #327eff;
  background-color: transparent; }

.button-clear-md-primary.activated {
  background-color: rgba(158, 158, 158, 0.2);
  box-shadow: none; }

.button-clear-md-primary:hover:not(.disable-hover) {
  color: #327eff; }

.button-md-secondary {
  color: #fff;
  background-color: #32db64; }

.button-md-secondary:hover:not(.disable-hover) {
  background-color: #32db64; }

.button-md-secondary.activated {
  background-color: #2ec95c;
  opacity: 1; }

.button-md-secondary .button-effect {
  background-color: #fff; }

.button-outline-md-secondary {
  border-color: #30d05f;
  color: #30d05f;
  background-color: transparent; }

.button-outline-md-secondary:hover:not(.disable-hover) {
  background-color: rgba(158, 158, 158, 0.1); }

.button-outline-md-secondary.activated {
  background-color: transparent; }

.button-outline-md-secondary .button-effect {
  background-color: #30d05f; }

.button-clear-md-secondary {
  border-color: transparent;
  color: #32db64;
  background-color: transparent; }

.button-clear-md-secondary.activated {
  background-color: rgba(158, 158, 158, 0.2);
  box-shadow: none; }

.button-clear-md-secondary:hover:not(.disable-hover) {
  color: #32db64; }

.button-md-danger {
  color: #fff;
  background-color: #f53d3d; }

.button-md-danger:hover:not(.disable-hover) {
  background-color: #f53d3d; }

.button-md-danger.activated {
  background-color: #e13838;
  opacity: 1; }

.button-md-danger .button-effect {
  background-color: #fff; }

.button-outline-md-danger {
  border-color: #e93a3a;
  color: #e93a3a;
  background-color: transparent; }

.button-outline-md-danger:hover:not(.disable-hover) {
  background-color: rgba(158, 158, 158, 0.1); }

.button-outline-md-danger.activated {
  background-color: transparent; }

.button-outline-md-danger .button-effect {
  background-color: #e93a3a; }

.button-clear-md-danger {
  border-color: transparent;
  color: #f53d3d;
  background-color: transparent; }

.button-clear-md-danger.activated {
  background-color: rgba(158, 158, 158, 0.2);
  box-shadow: none; }

.button-clear-md-danger:hover:not(.disable-hover) {
  color: #f53d3d; }

.button-md-light {
  color: #000;
  background-color: #f4f4f4; }

.button-md-light:hover:not(.disable-hover) {
  background-color: #f4f4f4; }

.button-md-light.activated {
  background-color: #e0e0e0;
  opacity: 1; }

.button-md-light .button-effect {
  background-color: #000; }

.button-outline-md-light {
  border-color: #e8e8e8;
  color: #e8e8e8;
  background-color: transparent; }

.button-outline-md-light:hover:not(.disable-hover) {
  background-color: rgba(158, 158, 158, 0.1); }

.button-outline-md-light.activated {
  background-color: transparent; }

.button-outline-md-light .button-effect {
  background-color: #e8e8e8; }

.button-clear-md-light {
  border-color: transparent;
  color: #f4f4f4;
  background-color: transparent; }

.button-clear-md-light.activated {
  background-color: rgba(158, 158, 158, 0.2);
  box-shadow: none; }

.button-clear-md-light:hover:not(.disable-hover) {
  color: #f4f4f4; }

.button-md-dark {
  color: #fff;
  background-color: #222; }

.button-md-dark:hover:not(.disable-hover) {
  background-color: #222; }

.button-md-dark.activated {
  background-color: #343434;
  opacity: 1; }

.button-md-dark .button-effect {
  background-color: #fff; }

.button-outline-md-dark {
  border-color: #2d2d2d;
  color: #2d2d2d;
  background-color: transparent; }

.button-outline-md-dark:hover:not(.disable-hover) {
  background-color: rgba(158, 158, 158, 0.1); }

.button-outline-md-dark.activated {
  background-color: transparent; }

.button-outline-md-dark .button-effect {
  background-color: #2d2d2d; }

.button-clear-md-dark {
  border-color: transparent;
  color: #222;
  background-color: transparent; }

.button-clear-md-dark.activated {
  background-color: rgba(158, 158, 158, 0.2);
  box-shadow: none; }

.button-clear-md-dark:hover:not(.disable-hover) {
  color: #222; }

.button-strong-md {
  font-weight: bold; }

.button-wp {
  margin: 0.4rem 0.2rem;
  padding: 0 1.1em;
  height: 3.6rem;
  border: 3px solid transparent;
  border-radius: 0;
  font-size: 1.4rem;
  color: #fff;
  background-color: #327eff; }

.button-wp:hover:not(.disable-hover) {
  border-color: #2e74eb;
  background-color: #327eff; }

.button-wp.activated {
  background-color: #2e74eb; }

.button-large-wp {
  padding: 0 1em;
  height: 2.8em;
  font-size: 2rem; }

.button-small-wp {
  padding: 0 0.9em;
  height: 2.1em;
  font-size: 1.3rem; }

.button-small-wp[icon-only] ion-icon {
  font-size: 1.4em; }

.button-block-wp {
  margin-right: 0;
  margin-left: 0; }

.button-full-wp {
  margin-right: 0;
  margin-left: 0;
  border-right-width: 0;
  border-left-width: 0;
  border-radius: 0; }

.button-outline-wp {
  border-width: 1px;
  border-style: solid;
  border-color: #327eff;
  color: #327eff;
  background-color: transparent; }

.button-outline-wp:hover:not(.disable-hover) {
  background-color: rgba(158, 158, 158, 0.1); }

.button-outline-wp.activated {
  background-color: rgba(50, 126, 255, 0.16); }

.button-clear-wp {
  color: #327eff;
  background-color: transparent; }

.button-clear-wp.activated {
  background-color: rgba(158, 158, 158, 0.2); }

.button-clear-wp:hover:not(.disable-hover) {
  background-color: rgba(158, 158, 158, 0.1); }

.button-round-wp {
  padding: 0 2.6rem;
  border-radius: 64px; }

.button-wp [icon-only] {
  padding: 0; }

.button-wp-primary {
  color: #fff;
  background-color: #327eff; }

.button-wp-primary:hover:not(.disable-hover) {
  border-color: #2e74eb;
  background-color: #327eff; }

.button-wp-primary.activated {
  background-color: #2e74eb; }

.button-outline-wp-primary {
  border-color: #3078f2;
  color: #3078f2;
  background-color: transparent; }

.button-outline-wp-primary:hover:not(.disable-hover) {
  border-color: #3078f2;
  background-color: rgba(158, 158, 158, 0.1); }

.button-outline-wp-primary.activated {
  background-color: rgba(48, 120, 242, 0.16); }

.button-clear-wp-primary {
  color: #327eff;
  background-color: transparent; }

.button-clear-wp-primary.activated {
  background-color: rgba(158, 158, 158, 0.2); }

.button-clear-wp-primary:hover:not(.disable-hover) {
  color: #327eff; }

.button-wp-secondary {
  color: #fff;
  background-color: #32db64; }

.button-wp-secondary:hover:not(.disable-hover) {
  border-color: #2ec95c;
  background-color: #32db64; }

.button-wp-secondary.activated {
  background-color: #2ec95c; }

.button-outline-wp-secondary {
  border-color: #30d05f;
  color: #30d05f;
  background-color: transparent; }

.button-outline-wp-secondary:hover:not(.disable-hover) {
  border-color: #30d05f;
  background-color: rgba(158, 158, 158, 0.1); }

.button-outline-wp-secondary.activated {
  background-color: rgba(48, 208, 95, 0.16); }

.button-clear-wp-secondary {
  color: #32db64;
  background-color: transparent; }

.button-clear-wp-secondary.activated {
  background-color: rgba(158, 158, 158, 0.2); }

.button-clear-wp-secondary:hover:not(.disable-hover) {
  color: #32db64; }

.button-wp-danger {
  color: #fff;
  background-color: #f53d3d; }

.button-wp-danger:hover:not(.disable-hover) {
  border-color: #e13838;
  background-color: #f53d3d; }

.button-wp-danger.activated {
  background-color: #e13838; }

.button-outline-wp-danger {
  border-color: #e93a3a;
  color: #e93a3a;
  background-color: transparent; }

.button-outline-wp-danger:hover:not(.disable-hover) {
  border-color: #e93a3a;
  background-color: rgba(158, 158, 158, 0.1); }

.button-outline-wp-danger.activated {
  background-color: rgba(233, 58, 58, 0.16); }

.button-clear-wp-danger {
  color: #f53d3d;
  background-color: transparent; }

.button-clear-wp-danger.activated {
  background-color: rgba(158, 158, 158, 0.2); }

.button-clear-wp-danger:hover:not(.disable-hover) {
  color: #f53d3d; }

.button-wp-light {
  color: #000;
  background-color: #f4f4f4; }

.button-wp-light:hover:not(.disable-hover) {
  border-color: #e0e0e0;
  background-color: #f4f4f4; }

.button-wp-light.activated {
  background-color: #e0e0e0; }

.button-outline-wp-light {
  border-color: #e8e8e8;
  color: #e8e8e8;
  background-color: transparent; }

.button-outline-wp-light:hover:not(.disable-hover) {
  border-color: #e8e8e8;
  background-color: rgba(158, 158, 158, 0.1); }

.button-outline-wp-light.activated {
  background-color: rgba(232, 232, 232, 0.16); }

.button-clear-wp-light {
  color: #f4f4f4;
  background-color: transparent; }

.button-clear-wp-light.activated {
  background-color: rgba(158, 158, 158, 0.2); }

.button-clear-wp-light:hover:not(.disable-hover) {
  color: #f4f4f4; }

.button-wp-dark {
  color: #fff;
  background-color: #222; }

.button-wp-dark:hover:not(.disable-hover) {
  border-color: #343434;
  background-color: #222; }

.button-wp-dark.activated {
  background-color: #343434; }

.button-outline-wp-dark {
  border-color: #2d2d2d;
  color: #2d2d2d;
  background-color: transparent; }

.button-outline-wp-dark:hover:not(.disable-hover) {
  border-color: #2d2d2d;
  background-color: rgba(158, 158, 158, 0.1); }

.button-outline-wp-dark.activated {
  background-color: rgba(45, 45, 45, 0.16); }

.button-clear-wp-dark {
  color: #222;
  background-color: transparent; }

.button-clear-wp-dark.activated {
  background-color: rgba(158, 158, 158, 0.2); }

.button-clear-wp-dark:hover:not(.disable-hover) {
  color: #222; }

.button-strong-wp {
  font-weight: bold; }
    `;
  }

}
