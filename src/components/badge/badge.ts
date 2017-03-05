import { IonElement, h, VNode } from '../../element/ion-element';


export class IonBadge extends IonElement {

  render(): VNode {
    return h('.badge');
  }

}

IonBadge.prototype['$css'] = `



/* Badge */
/* -------------------------------------------------- */

/* @prop - Font size of the badge */
$badge-font-size:                 1.3rem !default;

/* @prop - Font weight of the badge */
$badge-font-weight:               bold !default;


ion-badge {
  display: inline-block;

  padding: 3px 8px;

  min-width: 10px;

  font-size: $badge-font-size;
  font-weight: $badge-font-weight;
  line-height: 1;

  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
}

ion-badge:empty {
  display: none;
}




/* iOS Badge */
/* -------------------------------------------------- */

/* @prop - Border radius of the badge */
$badge-ios-border-radius:      10px !default;

/* @prop - Background color of the badge */
$badge-ios-background-color:   color($colors-ios, primary) !default;

/* @prop - Text color of the badge */
$badge-ios-text-color:         color-contrast($colors-ios, $badge-ios-background-color) !default;


.badge-ios {
  border-radius: $badge-ios-border-radius;
  color: $badge-ios-text-color;
  background-color: $badge-ios-background-color;
}


/* Generate iOS Badge Colors */
/* -------------------------------------------------- */

@each $color-name, $color-base, $color-contrast in get-colors($colors-ios) {

  .badge-ios-#{$color-name} {
    color: $color-contrast;
    background-color: $color-base;
  }

}




/* Material Design Badge */
/* -------------------------------------------------- */

/* @prop - Border radius of the badge */
$badge-md-border-radius:            4px !default;

/* @prop - Background color of the badge */
$badge-md-background-color:         color($colors-md, primary) !default;

/* @prop - Text color of the badge */
$badge-md-text-color:               color-contrast($colors-md, $badge-md-background-color) !default;


.badge-md {
  border-radius: $badge-md-border-radius;
  color: $badge-md-text-color;
  background-color: $badge-md-background-color;
}


/* Generate Material Design Badge Colors */
/* -------------------------------------------------- */

@each $color-name, $color-base, $color-contrast in get-colors($colors-md) {

  .badge-md-#{$color-name} {
    color: $color-contrast;
    background-color: $color-base;
  }

}




/* Windows Badge */
/* -------------------------------------------------- */

/* @prop - Border radius of the badge */
$badge-wp-border-radius:            0 !default;

/* @prop - Background color of the badge */
$badge-wp-background-color:         color($colors-wp, primary) !default;

/* @prop - Text color of the badge */
$badge-wp-text-color:               color-contrast($colors-wp, $badge-wp-background-color) !default;


.badge-wp {
  border-radius: $badge-wp-border-radius;
  color: $badge-wp-text-color;
  background-color: $badge-wp-background-color;
}


/* Generate Windows Badge Colors */
/* -------------------------------------------------- */

@each $color-name, $color-base, $color-contrast in get-colors($colors-wp) {

  .badge-wp-#{$color-name} {
    color: $color-contrast;
    background-color: $color-base;
  }

}

`;
