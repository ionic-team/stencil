import { Component, Prop, h } from '@stencil/core';

/**
  * @name Route
  * @module ionic
  * @description
 */
@Component({
  tag: 'ion-route'
})
export class Route {
  @Prop() url: string;

  // The instance of the router
  @Prop() router: any;

  render() {
    const router = document.querySelector(this.router);
    const match = router.match
    console.log(`  <ion-route> Rendering route ${this.url}`, router, match);

    return (
      <slot></slot>
    );
  }
}
