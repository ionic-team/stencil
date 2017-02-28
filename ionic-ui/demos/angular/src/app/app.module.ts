import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MyApp } from './app.component';

import { IonBadge } from 'ionic-ui';

(<any>window).customElements.define('ion-badge', IonBadge);


@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule
  ],
  bootstrap: [MyApp],
  entryComponents: [
    MyApp,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule {}



import { Directive, ElementRef, Input, Renderer } from '@angular/core';
