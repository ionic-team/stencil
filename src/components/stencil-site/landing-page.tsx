import { Component, h, Prop } from '@stencil/core';


@Component({
  tag: 'landing-page',
  styleUrl: 'landing-page.scss'
})
export class LandingPage {
  render() {
    return (
      <div>
        <img src="img/logo.png" />
        <h1>The magical, reusable web component generator.</h1>
        <h4>Reactive Web Component build tool for modern web development.</h4>
        <stencil-route-link router="#router" url="docs" custom={true}>
          <ion-button color="purple">Get started</ion-button>
        </stencil-route-link>
      </div>
    );
  }
}
