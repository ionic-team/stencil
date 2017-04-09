# Test Node Modules

Contains the same node_module directories that would ship from upcoming versions of npm.

- Copy `ionic-angular` and `@ionic/app-scripts` into an Ionic app's node_modules.
- Ensure there is at least one `ion-badge` in the app that is viewable.
- Build the app no differently than it would have been built before. Again, we're assuming these packages were the same as the ones downloaded from npm.
- You'll get an error like `'ion-badge' is not a known element`, to fix this add the `CUSTOM_ELEMENTS_SCHEMA` to the `@NgModule`, see below.
- Take notes about anything that needed to be changed for the app or build process.
- Run the app on as many browsers and devices as you can think of. Be on the look out for any runtime errors. "Should" be fine on modern chrome, but really test on old Android, iOS, Safari and Firefox (and Edge if you're feelin' lucky).
- Ensure a bunch of `ionic.` prefixed files show up in the `www/build/` directory.
- Ensure `build/ionic.core.js` was a file downloaded in the network tab on the initial page load.
- Ensure your `ion-badge` loaded up with the correct color and mode. When the `ion-badge` is first seen is when `build/ionic.0.js` (md mode) or `build/ionic.1.js` (ios mode) would have been requested.


### CUSTOM_ELEMENTS_SCHEMA

Sadly, to use a web component in Angular you need to add another config to the `@NgModule`. If we can get around that then that'd be awesome, but haven't figure out a way yet (looking for ideas, plz help). To fix the error, import `CUSTOM_ELEMENTS_SCHEMA` from `@angular/core` and add it to the `schemas` like this:

```
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { IonicApp, IonicModule } from 'ionic-angular';


@NgModule({
  declarations: [...],
  imports: [
    BrowserModule,
    IonicModule.forRoot(ConferenceApp, {}, {
      links: [...]
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [...],
  providers: [...],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
```

:lollipop:
