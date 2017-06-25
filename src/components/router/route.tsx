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

  @Prop() match: any;

  render() {
    const match = this.match
    console.log(`  <ion-route> Rendering route ${this.url}`, router, match);

    return (
      <slot></slot>
    );
  }
}
