import { Component, h } from '@stencil/core';

/**
  * @name Avatar
  * @module ionic
  * @description
  * An Avatar is a component that creates a circular image for an item.
  * Avatars can be placed on the left or right side of an item with the `item-start` or `item-end` directive.
  * @see {@link /docs/components/#avatar-list Avatar Component Docs}
 */
@Component({
  tag: 'ion-router'
})
export class Router {
  render() {
    console.log('Router rendering')
    return (
      <div>
        <h1>Router!</h1>
        <slot></slot>
      </div>
    );
  }
}
