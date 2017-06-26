import { Component, h } from '@stencil/core';

/**
  * @name Router
  * @module ionic
  * @description
 */
@Component({
  tag: 'ion-router'
})
export class Router {
  $el: HTMLElement;

  @State() routeMatch: any = {};

  @Prop()
  get match() {
    return this.routeMatch
  }

  @Prop()
  navigateTo(url, data={}) {
    window.history.pushState(null, null, url);
    this.routeMatch = {
      url: '/' + url
    }
    console.log('Route match', this.routeMatch);

    console.log('Emitting event');
    Ionic.emit(this.$instance, 'ionRouterNavigation', { detail: this.routeMatch });
  }

  componentDidLoad() {
    console.log('<ion-router> loaded');
    window.addEventListener('popstate', this.handlePopState.bind(this));
    window.addEventListener('hashchange', this.handleHashChange.bind(this));

    Ionic.emit(this.$instance, 'ionRouterNavigation', { detail: "/" });
  }

  handlePopState(e) {
    console.log('Pop state', e)
  }

  handleHashChange(e) {
    console.log('Hash change', e)
  }

  render() {
    console.log('<ion-router> rendering')
    return (
      <slot></slot>
    );
  }
}
