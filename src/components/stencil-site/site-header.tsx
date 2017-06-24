import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'site-header'
})
export class SiteHeader {
  render() {
    return (
      <ion-header>
        <ion-toolbar color='primary'>
          <ion-grid>
            <ion-row>
              <ion-col>
                <img src="logo.png" />
              </ion-col>
              <ion-col>
                <ul>
                  <li><a href="/docs">Docs</a></li>
                </ul>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-toolbar>
      </ion-header>
    )
  }
}
