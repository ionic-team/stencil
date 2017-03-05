import { IonElement, h, VNode } from '../../element/ion-element';


export class IonList extends IonElement {
  render(): VNode {
    return h('.list');
  }

}


IonList.prototype['$css'] = `



/* List */
/* -------------------------------------------------- */

ion-list-header {
  display: flex;
  overflow: hidden;

  align-items: center;
  justify-content: space-between;

  margin: 0;
  padding: 0;

  width: 100%;
  min-height: 4rem;
}

ion-list {
  display: block;

  margin: 0;
  padding: 0;

  list-style-type: none;
}

ion-list[inset] {
  overflow: hidden;

  transform: translateZ(0);
}




/* Material Design List */
/* -------------------------------------------------- */

/* @prop - Margin top of the list */
$list-md-margin-top:             16px !default;

/* @prop - Margin right of the list */
$list-md-margin-right:           0 !default;

/* @prop - Margin bottom of the list */
$list-md-margin-bottom:          16px !default;

/* @prop - Margin left of the list */
$list-md-margin-left:            0 !default;

/* @prop - Margin top of the inset list */
$list-inset-md-margin-top:       16px !default;

/* @prop - Margin right of the inset list */
$list-inset-md-margin-right:     16px !default;

/* @prop - Margin bottom of the inset list */
$list-inset-md-margin-bottom:    16px !default;

/* @prop - Margin left of the inset list */
$list-inset-md-margin-left:      16px !default;

/* @prop - Border radius of the inset list */
$list-inset-md-border-radius:    2px !default;

/* @prop - Margin bottom of the header in a list */
$list-md-header-margin-bottom:   13px !default;

/* @prop - Padding left of the header in a list */
$list-md-header-padding-left:    $item-md-padding-left !default;

/* @prop - Minimum height of the header in a list */
$list-md-header-min-height:      4.5rem !default;

/* @prop - Border top of the header in a list */
$list-md-header-border-top:      1px solid $list-md-border-color !default;

/* @prop - Font size of the header in a list */
$list-md-header-font-size:       1.4rem !default;

/* @prop - Text color of the header in a list */
$list-md-header-color:           #757575 !default;


/* Material Design Default List */
/* -------------------------------------------------- */

.list-md {
  margin: -1px $list-md-margin-right $list-md-margin-bottom $list-md-margin-left;
}

.list-md .item-block .item-inner {
  border-bottom: 1px solid $list-md-border-color;
}

.list-md > .item-block:last-child,
.list-md > .item-wrapper:last-child {
  ion-label,
  .item-inner {
    border-bottom: 0;
  }
}

.list-md > ion-input:last-child::after {
  left: 0;
}

.list-md ion-item-options {
  border-bottom: 1px solid $list-md-border-color;
}

.list-md ion-item-options .button {
  display: inline-flex;

  align-items: center;

  margin: 1px 0;

  height: calc(100% - 2px);

  border: 0;
  border-radius: 0;
  box-shadow: none;

  box-sizing: border-box;
}

.list-md ion-item-options .button::before {
  margin: 0 auto;
}

/* If the item has the no-lines attribute remove the bottom border from:
/* the item itself (for last-child items)
/* the item-inner class (if it is not last)
.list-md .item[no-lines],
.list-md .item[no-lines] .item-inner {
  border-width: 0;
}

.list-md + ion-list ion-list-header {
  margin-top: -$list-md-margin-top;
}


/* Material Design Inset List */
/* -------------------------------------------------- */

.list-md[inset] {
  margin: $list-inset-md-margin-top $list-inset-md-margin-right $list-inset-md-margin-bottom $list-inset-md-margin-left;

  border-radius: $list-inset-md-border-radius;
}

.list-md[inset] .item:first-child {
  border-top-width: 0;
  border-top-left-radius: $list-inset-md-border-radius;
  border-top-right-radius: $list-inset-md-border-radius;
}

.list-md[inset] .item:last-child {
  border-bottom-width: 0;
  border-bottom-left-radius: $list-inset-md-border-radius;
  border-bottom-right-radius: $list-inset-md-border-radius;
}

.list-md[inset] .item-input {
  padding-right: 0;
  padding-left: 0;
}

.list-md[inset] + ion-list[inset] {
  margin-top: 0;
}

.list-md[inset] ion-list-header {
  background-color: $list-md-background-color;
}


/* Material Design No Lines List */
/* -------------------------------------------------- */

.list-md[no-lines] .item-block,
.list-md[no-lines] ion-item-options,
.list-md[no-lines] .item .item-inner {
  border-width: 0;
}




/* iOS List */
/* -------------------------------------------------- */

/* @prop - Margin top of the list */
$list-ios-margin-top:                 10px !default;

/* @prop - Margin right of the list */
$list-ios-margin-right:               0 !default;

/* @prop - Margin bottom of the list */
$list-ios-margin-bottom:              32px !default;

/* @prop - Margin left of the list */
$list-ios-margin-left:                0 !default;

/* @prop - Margin top of the inset list */
$list-inset-ios-margin-top:           16px !default;

/* @prop - Margin right of the inset list */
$list-inset-ios-margin-right:         16px !default;

/* @prop - Margin bottom of the inset list */
$list-inset-ios-margin-bottom:        16px !default;

/* @prop - Margin left of the inset list */
$list-inset-ios-margin-left:          16px !default;

/* @prop - Border radius of the inset list */
$list-inset-ios-border-radius:        4px !default;

/* @prop - Padding left of the header in a list */
$list-ios-header-padding-left:        $item-ios-padding-left !default;

/* @prop - Border bottom of the header in a list */
$list-ios-header-border-bottom:       $hairlines-width solid $list-ios-border-color !default;

/* @prop - Font size of the header in a list */
$list-ios-header-font-size:           1.2rem !default;

/* @prop - Font weight of the header in a list */
$list-ios-header-font-weight:         500 !default;

/* @prop - Letter spacing of the header in a list */
$list-ios-header-letter-spacing:      .1rem !default;

/* @prop - Text transform of the header in a list */
$list-ios-header-text-transform:      uppercase !default;

/* @prop - Text color of the header in a list */
$list-ios-header-color:               #333 !default;

/* @prop - Background color of the header in a list */
$list-ios-header-background-color:    transparent !default;


/* iOS Default List */
/* -------------------------------------------------- */

.list-ios {
  margin: -1px $list-ios-margin-right $list-ios-margin-bottom $list-ios-margin-left;
}

.list-ios > .item-block:first-child {
  border-top: $hairlines-width solid $list-ios-border-color;
}

.list-ios > .item-block:last-child,
.list-ios > .item-wrapper:last-child .item-block {
  border-bottom: $hairlines-width solid $list-ios-border-color;
}

.list-ios > .item-block:last-child .item-inner,
.list-ios > .item-wrapper:last-child .item-block .item-inner {
  border-bottom: 0;
}

.list-ios .item-block .item-inner {
  border-bottom: $hairlines-width solid $list-ios-border-color;
}

/* If the item has the no-lines attribute remove the bottom border from:
/* the item itself (for last-child items)
/* the item-inner class (if it is not last)
.list-ios .item[no-lines],
.list-ios .item[no-lines] .item-inner, {
  border-width: 0;
}

.list-ios ion-item-options {
  border-bottom: $hairlines-width solid $list-ios-border-color;
}

.list-ios ion-item-options .button {
  display: inline-flex;

  align-items: center;

  margin: 0;

  height: 100%;
  min-height: 100%;

  border: 0;
  border-radius: 0;

  box-sizing: border-box;
}

.list-ios ion-item-options .button::before {
  margin: 0 auto;
}

.list-ios:not([inset]) + .list-ios:not([inset]) ion-list-header {
  margin-top: -$list-ios-margin-top;
  padding-top: 0;
}


/* iOS Inset List */
/* -------------------------------------------------- */

.list-ios[inset] {
  margin: $list-inset-ios-margin-top $list-inset-ios-margin-right $list-inset-ios-margin-bottom $list-inset-ios-margin-left;

  border-radius: $list-inset-ios-border-radius;
}

.list-ios[inset] ion-list-header {
  background-color: $list-ios-background-color;
}

.list-ios[inset] .item {
  border-bottom: 1px solid $list-ios-border-color;
}

.list-ios[inset] .item-inner {
  border-bottom: 0;
}

.list-ios[inset] > .item:first-child,
.list-ios[inset] > .item-wrapper:first-child .item {
  border-top: 0;
}

.list-ios[inset] > .item:last-child,
.list-ios[inset] > .item-wrapper:last-child .item {
  border-bottom: 0;
}

.list-ios[inset] + ion-list[inset] {
  margin-top: 0;
}


/* iOS No Lines List */
/* -------------------------------------------------- */

.list-ios[no-lines] ion-list-header,
.list-ios[no-lines] ion-item-options,
.list-ios[no-lines] .item,
.list-ios[no-lines] .item .item-inner {
  border-width: 0;
}


/* iOS List Header */
/* -------------------------------------------------- */

.list-header-ios {
  position: relative;

  padding-left: $list-ios-header-padding-left;

  border-bottom: $list-ios-header-border-bottom;
  font-size: $list-ios-header-font-size;
  font-weight: $list-ios-header-font-weight;
  letter-spacing: $list-ios-header-letter-spacing;
  text-transform: $list-ios-header-text-transform;
  color: $list-ios-header-color;
  background: $list-ios-header-background-color;
}


/* Generate iOS List Header Colors */
/* -------------------------------------------------- */

@each $color-name, $color-base, $color-contrast in get-colors($colors-ios) {
  .list-header-ios-#{$color-name} {
    color: $color-contrast;
    background-color: $color-base;
  }
}




/* Material Design List Header */
/* -------------------------------------------------- */

.list-header-md {
  margin-bottom: $list-md-header-margin-bottom;
  padding-left: $list-md-header-padding-left;

  min-height: $list-md-header-min-height;

  border-top: $list-md-header-border-top;
  font-size: $list-md-header-font-size;
  color: $list-md-header-color;
}


/* Generate Material Design List Header Colors */
/* -------------------------------------------------- */

@each $color-name, $color-base, $color-contrast in get-colors($colors-md) {
  .list-header-md-#{$color-name} {
    color: $color-contrast;
    background-color: $color-base;
  }
}


/* Material Design List inputs */
/* -------------------------------------------------- */

.list-md .item-input:last-child {
  border-bottom: 1px solid $list-md-border-color;
}




/* Windows List */
/* -------------------------------------------------- */

/* @prop - Margin top of the list */
$list-wp-margin-top:             16px !default;

/* @prop - Margin right of the list */
$list-wp-margin-right:           0 !default;

/* @prop - Margin bottom of the list */
$list-wp-margin-bottom:          16px !default;

/* @prop - Margin left of the list */
$list-wp-margin-left:            0 !default;

/* @prop - Margin top of the inset list */
$list-inset-wp-margin-top:       16px !default;

/* @prop - Margin right of the inset list */
$list-inset-wp-margin-right:     16px !default;

/* @prop - Margin bottom of the inset list */
$list-inset-wp-margin-bottom:    16px !default;

/* @prop - Margin left of the inset list */
$list-inset-wp-margin-left:      16px !default;

/* @prop - Border radius of the inset list */
$list-inset-wp-border-radius:    2px !default;

/* @prop - Padding left of the header in a list */
$list-wp-header-padding-left:    $item-wp-padding-left !default;

/* @prop - Border bottom of the header in a list */
$list-wp-header-border-bottom:   1px solid $list-wp-border-color !default;

/* @prop - Font size of the header in a list */
$list-wp-header-font-size:       2rem !default;

/* @prop - Text color of the header in a list */
$list-wp-header-color:           $list-wp-text-color !default;


/* Windows Default List */
/* -------------------------------------------------- */

.list-wp {
  margin: 0 $list-wp-margin-right $list-wp-margin-bottom $list-wp-margin-left;
}

.list-wp .item-block .item-inner {
  border-bottom: 1px solid $list-wp-border-color;
}

.list-wp > .item-block:first-child,
.list-wp > .item-wrapper:first-child .item-block {
  border-top: 1px solid $list-wp-border-color;
}

.list-wp > .item-block:last-child,
.list-wp > .item-wrapper:last-child .item-block {
  border-bottom: 1px solid $list-wp-border-color;
}

.list-wp > .item-block:last-child,
.list-wp > .item-wrapper:last-child {
  ion-label,
  .item-inner {
    border-bottom: 0;
  }
}

.list-wp > ion-input:last-child::after {
  left: 0;
}

.list-wp ion-item-options .button {
  display: inline-flex;

  align-items: center;

  margin: 1px 0;

  height: calc(100% - 2px);

  border: 0;
  border-radius: 0;
  box-shadow: none;

  box-sizing: border-box;
}

.list-wp ion-item-options .button::before {
  margin: 0 auto;
}

/* If the item has the no-lines attribute remove the bottom border from:
/* the item itself (for last-child items)
/* the item-inner class (if it is not last)
.list-wp .item[no-lines],
.list-wp .item[no-lines] .item-inner {
  border-width: 0;
}

.list-wp + ion-list ion-list-header {
  margin-top: -$list-wp-margin-top;
  padding-top: 0;
}


/* Windows Insert List */
/* -------------------------------------------------- */

.list-wp[inset] {
  margin: $list-inset-wp-margin-top $list-inset-wp-margin-right $list-inset-wp-margin-bottom $list-inset-wp-margin-left;

  border-radius: $list-inset-wp-border-radius;
}

.list-wp[inset] .item:first-child {
  border-top-width: 0;
  border-top-left-radius: $list-inset-wp-border-radius;
  border-top-right-radius: $list-inset-wp-border-radius;
}

.list-wp[inset] .item:last-child {
  border-bottom-width: 0;
  border-bottom-left-radius: $list-inset-wp-border-radius;
  border-bottom-right-radius: $list-inset-wp-border-radius;
}

.list-wp[inset] .item-input {
  padding-right: 0;
  padding-left: 0;
}

.list-wp[inset] + ion-list[inset] {
  margin-top: 0;
}

.list-wp[inset] ion-list-header {
  background-color: $list-wp-background-color;
}




/* Windows No Lines List */
/* -------------------------------------------------- */

.list-wp[no-lines] .item,
.list-wp[no-lines] .item .item-inner {
  border-width: 0;
}


/* Windows List Header */
/* -------------------------------------------------- */

.list-header-wp {
  padding-left: $list-wp-header-padding-left;

  border-bottom: $list-wp-header-border-bottom;
  font-size: $list-wp-header-font-size;
  color: $list-wp-header-color;
}


/* Generate Windows List Header Colors */
/* -------------------------------------------------- */

@each $color-name, $color-base, $color-contrast in get-colors($colors-wp) {
  .list-header-wp-#{$color-name} {
    color: $color-contrast;
    background-color: $color-base;
  }
}


`;
