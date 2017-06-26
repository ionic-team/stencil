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
  $el: HTMLElement;

  @Prop() url: string;

  // The instance of the router
  @Prop() router: any;

  //@Prop() match: any;
  @State() match: any = {};

  componentDidLoad() {
    this.routerInstance = document.querySelector(this.router)

    console.log('Router instance in componentDidLoad', this.routerInstance)

    // HACK
    this.routerInstance.addEventListener('ionRouterNavigation', (e) => {
      console.log('NAVIGATION IN ROUTER', e);
      this.match = e.detail;
    })
  }

  render() {
    const match = this.match

    console.log('Does match match?', match.url, this.url)

    //return <p></p>;

    let styles = {}
    if(match.url == this.url) {
      console.log(`  <ion-route> Rendering route ${this.url}`, router, match);
    } else {
      styles = { display: 'none' }
    }
    return (<div style={styles}><slot></slot></div>);
  }
}
