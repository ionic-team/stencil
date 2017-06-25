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
  @State() routeMatch: any = {};

  @Prop()
  get match() {
    return this.routeMatch
  }

  @Prop()
  navigateTo(url, data={}) {
    window.history.pushState(null, null, url);
    this.routeMatch = {
      url: url
    }
  }

  ionViewDidLoad() {
    console.log('<ion-router> loaded');
    window.addEventListener('popstate', this.handlePopState.bind(this));
    window.addEventListener('hashchange', this.handleHashChange.bind(this));
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
