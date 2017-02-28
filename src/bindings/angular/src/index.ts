import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';


import { AppRootToken } from './components/app/app-root';


@NgModule({
  imports: [HttpModule, FormsModule, ReactiveFormsModule],
  exports: [],
  declarations: [],
  entryComponents: []
})
export class IonicModule {
    /**
     * Set the root app component for you IonicModule
     * @param {any} appRoot The root AppComponent for this app.
     * @param {any} config Config Options for the app. Accepts any config property.
     * @param {any} deepLinkConfig Any configuration needed for the Ionic Deeplinker.
     */
  static forRoot(appRoot: any): ModuleWithProviders {
    return {
      ngModule: IonicModule,
      providers: [
        { provide: AppRootToken, useValue: appRoot }
      ]
    };
  }

}
