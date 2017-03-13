"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var ionic_angular_1 = require('../../../../../ionic-angular');
var E2EPage = (function () {
    function E2EPage(app) {
        this.testingColors = ['primary', 'secondary', 'danger', 'dark'];
        this.testingColorIndex = 0;
        app.setTitle('Basic Buttons');
        this.chgColor();
    }
    E2EPage.prototype.chgColor = function () {
        this.btnColor = this.testingColors[this.testingColorIndex];
        console.log('dynamic btnColor', this.btnColor);
        this.testingColorIndex = (this.testingColorIndex >= this.testingColors.length - 1 ? 0 : this.testingColorIndex + 1);
    };
    E2EPage = __decorate([
        core_1.Component({
            templateUrl: 'main.html'
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.App !== 'undefined' && ionic_angular_1.App) === 'function' && _a) || Object])
    ], E2EPage);
    return E2EPage;
    var _a;
}());
exports.E2EPage = E2EPage;
var E2EApp = (function () {
    function E2EApp() {
        this.rootPage = E2EPage;
    }
    E2EApp = __decorate([
        core_1.Component({
            template: '<ion-nav [root]="rootPage"></ion-nav>'
        }), 
        __metadata('design:paramtypes', [])
    ], E2EApp);
    return E2EApp;
}());
exports.E2EApp = E2EApp;
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                E2EApp,
                E2EPage
            ],
            imports: [
                ionic_angular_1.IonicModule.forRoot(E2EApp)
            ],
            bootstrap: [ionic_angular_1.IonicApp],
            entryComponents: [
                E2EPage
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;