import { IonElement, h, VNode } from '../../element/ion-element';


export class IonContent extends IonElement {

  render(): VNode {
    return h('.content');
  }

}

IonContent.prototype['$css'] = `


/* Content */
/* -------------------------------------------------- */

ion-content {
  position: relative;
  top: 0;
  left: 0;
  display: block;

  width: 100%;
  height: 100%;

  contain: layout size style;
}

.ion-page > ion-content {
  position: absolute;
}

a {
  color: $link-color;
}


/* Scrollable Content */
/* -------------------------------------------------- */

.scroll-content {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: $z-index-scroll-content;
  display: block;

  overflow-x: hidden;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  will-change: scroll-position;

  contain: size style layout;
}

ion-content.js-scroll > .scroll-content {
  position: relative;

  min-height: 100%;

  overflow-x: initial;
  overflow-y: initial;
  -webkit-overflow-scrolling: auto;
  will-change: initial;
}

.disable-scroll .ion-page {
  pointer-events: none;
  touch-action: none;
}


/* Fixed Content (ion-fixed and ion-fab) */
/* -------------------------------------------------- */

.fixed-content {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: block;
}

[ion-fixed] {
  position: absolute;

  z-index: $z-index-fixed-content;

  transform: translateZ(0);
}


/* Content Padding */
/* -------------------------------------------------- */

ion-app [no-padding],
ion-app [no-padding] .scroll-content {
  padding: 0;
}

@mixin content-padding($mode, $content-padding) {
  ion-app.#{$mode} [padding],
  ion-app.#{$mode} [padding] .scroll-content {
    padding: $content-padding;
  }

  ion-app.#{$mode} [padding-top],
  ion-app.#{$mode} [padding-top] .scroll-content {
    padding-top: $content-padding;
  }

  ion-app.#{$mode} [padding-left],
  ion-app.#{$mode} [padding-left] .scroll-content {
    padding-left: $content-padding;
  }

  ion-app.#{$mode} [padding-right],
  ion-app.#{$mode} [padding-right] .scroll-content {
    padding-right: $content-padding;
  }

  ion-app.#{$mode} [padding-bottom],
  ion-app.#{$mode} [padding-bottom] .scroll-content {
    padding-bottom: $content-padding;
  }

  ion-app.#{$mode} [padding-vertical],
  ion-app.#{$mode} [padding-vertical] .scroll-content {
    padding-top: $content-padding;
    padding-bottom: $content-padding;
  }

  ion-app.#{$mode} [padding-horizontal],
  ion-app.#{$mode} [padding-horizontal] .scroll-content {
    padding-right: $content-padding;
    padding-left: $content-padding;
  }
}


/* Content Margin */
/* -------------------------------------------------- */

ion-app [no-margin],
ion-app [no-margin] .scroll-content {
  margin: 0;
}

@mixin content-margin($mode, $content-margin) {
  ion-app.#{$mode} [margin],
  ion-app.#{$mode} [margin] .scroll-content {
    margin: $content-margin;
  }

  ion-app.#{$mode} [margin-top],
  ion-app.#{$mode} [margin-top] .scroll-content {
    margin-top: $content-margin;
  }

  ion-app.#{$mode} [margin-left],
  ion-app.#{$mode} [margin-left] .scroll-content {
    margin-left: $content-margin;
  }

  ion-app.#{$mode} [margin-right],
  ion-app.#{$mode} [margin-right] .scroll-content {
    margin-right: $content-margin;
  }

  ion-app.#{$mode} [margin-bottom],
  ion-app.#{$mode} [margin-bottom] .scroll-content {
    margin-bottom: $content-margin;
  }

  ion-app.#{$mode} [margin-vertical],
  ion-app.#{$mode} [margin-vertical] .scroll-content {
    margin-top: $content-margin;
    margin-bottom: $content-margin;
  }

  ion-app.#{$mode} [margin-horizontal],
  ion-app.#{$mode} [margin-horizontal] .scroll-content {
    margin-right: $content-margin;
    margin-left: $content-margin;
  }
}




/* iOS Content */
/* -------------------------------------------------- */

/* @prop - Background color of the outer content */
$content-ios-outer-background:          #efeff4 !default;

/* @prop - Background color of the content when making transition */
$content-ios-transition-background:     #000 !default;


.content-ios {
  color: $text-ios-color;
  background-color: $background-ios-color;
}

.content-ios.outer-content {
  background: $content-ios-outer-background;
}

.content-ios hr {
  height: $hairlines-width;

  background-color: rgba(0, 0, 0, .12);
}

.ios .ion-page.show-page ~ .nav-decor {
  /* when ios pages transition, the leaving page grays out */
  /* this is the black square behind all pages so they gray out */
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  display: block;

  width: 100%;
  height: 100%;

  background: $content-ios-transition-background;

  pointer-events: none;
}


/* iOS Content Padding */
/* -------------------------------------------------- */

@include content-padding('ios', $content-ios-padding);


/* iOS Content Margin */
/* -------------------------------------------------- */

@include content-margin('ios', $content-ios-margin);


/* iOS Content Scroll */
/* -------------------------------------------------- */

.content-ios:not([no-bounce]) > .scroll-content::before,
.content-ios:not([no-bounce]) > .scroll-content::after {
  position: absolute;

  width: 1px;
  height: 1px;

  content: "";
}

.content-ios:not([no-bounce]) > .scroll-content::before {
  bottom: -1px;
}

.content-ios:not([no-bounce]) > .scroll-content::after {
  top: -1px;
}




/* Material Design Content */
/* -------------------------------------------------- */

.content-md {
  color: $text-md-color;
  background-color: $background-md-color;
}

.content-md hr {
  background-color: rgba(0, 0, 0, .08);
}


/* Material Design Content Padding */
/* -------------------------------------------------- */

@include content-padding('md', $content-md-padding);


/* Material Design Content Margin */
/* -------------------------------------------------- */

@include content-margin('md', $content-md-margin);




/* Windows Content */
/* -------------------------------------------------- */

.content-wp {
  color: $text-wp-color;
  background-color: $background-wp-color;
}

.content-wp hr {
  background-color: rgba(0, 0, 0, .08);
}


/* Windows Content Padding */
/* -------------------------------------------------- */

@include content-padding('wp', $content-wp-padding);


/* Windows Content Margin */
/* -------------------------------------------------- */

@include content-margin('wp', $content-wp-margin);


`;
