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
var E2EPage2 = (function () {
    function E2EPage2() {
    }
    E2EPage2 = __decorate([
        core_1.Component({
            template: "\n  <ion-header>\n    <ion-navbar>\n      <button ion-button menuToggle>\n        <ion-icon name=\"menu\"></ion-icon>\n      </button>\n      <ion-title>Page 2</ion-title>\n    </ion-navbar>\n  </ion-header>\n  <ion-content padding>\n    <h1>Page 2</h1>\n  </ion-content>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], E2EPage2);
    return E2EPage2;
}());
exports.E2EPage2 = E2EPage2;
var E2EPage = (function () {
    function E2EPage(navCtrl, menuCtrl) {
        this.navCtrl = navCtrl;
        this.menuCtrl = menuCtrl;
    }
    E2EPage.prototype.push = function () {
        this.navCtrl.push(E2EPage2);
    };
    E2EPage.prototype.menu1Active = function () {
        this.menuCtrl.enable(true, 'menu1');
    };
    E2EPage.prototype.menu2Active = function () {
        this.menuCtrl.enable(true, 'menu2');
    };
    E2EPage.prototype.menu3Active = function () {
        this.menuCtrl.enable(true, 'menu3');
    };
    E2EPage.prototype.disableAll = function () {
        this.menuCtrl.enable(false);
    };
    E2EPage = __decorate([
        core_1.Component({
            template: "\n  <ion-header>\n    <ion-navbar>\n      <button ion-button menuToggle>\n        <ion-icon name=\"menu\"></ion-icon>\n      </button>\n      <ion-title>Navigation</ion-title>\n    </ion-navbar>\n  </ion-header>\n  <ion-content padding>\n    <h1>Page 1</h1>\n    <button ion-button (click)=\"push()\">Push</button>\n    <button ion-button (click)=\"menu1Active()\">Enable menu 1</button>\n    <button ion-button (click)=\"menu2Active()\">Enable menu 2</button>\n    <button ion-button (click)=\"menu3Active()\">Enable menu 3</button>\n    <button ion-button (click)=\"disableAll()\">Disable all</button>\n\n    <div f></div>\n    <div f></div>\n    <div f></div>\n    <div f></div>\n\n  </ion-content>\n  "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _a) || Object, (typeof (_b = typeof ionic_angular_1.MenuController !== 'undefined' && ionic_angular_1.MenuController) === 'function' && _b) || Object])
    ], E2EPage);
    return E2EPage;
    var _a, _b;
}());
exports.E2EPage = E2EPage;
var E2EApp = (function () {
    function E2EApp() {
        this.root = E2EPage;
    }
    E2EApp.prototype.splitPaneChanged = function (splitPane) {
        console.log('Split pane changed, visible: ', splitPane.isVisible());
    };
    E2EApp = __decorate([
        core_1.Component({
            templateUrl: 'main.html'
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
                E2EPage,
                E2EPage2,
            ],
            imports: [
                ionic_angular_1.IonicModule.forRoot(E2EApp, {
                    swipeBackEnabled: true
                })
            ],
            bootstrap: [ionic_angular_1.IonicApp],
            entryComponents: [
                E2EApp,
                E2EPage,
                E2EPage2,
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;