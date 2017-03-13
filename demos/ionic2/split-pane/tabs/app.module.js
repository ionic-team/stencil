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
var SidePage = (function () {
    function SidePage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    SidePage.prototype.push = function () {
        this.navCtrl.push(SidePage);
    };
    SidePage = __decorate([
        core_1.Component({
            template: "\n  <ion-header>\n  <ion-navbar><ion-title>Navigation</ion-title></ion-navbar>\n  </ion-header>\n  <ion-content>\n    <ion-slides style=\"background: black\"\n                pager=\"true\"\n                effect=\"flip\">\n\n      <ion-slide style=\"background: red; color: white;\">\n        <h1>Slide 1</h1>\n      </ion-slide>\n\n      <ion-slide style=\"background: white; color: blue;\">\n        <h1>Slide 2</h1>\n      </ion-slide>\n\n      <ion-slide style=\"background: blue; color: white;\">\n        <h1>Slide 3</h1>\n      </ion-slide>\n\n    </ion-slides>\n  </ion-content>\n  "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _a) || Object])
    ], SidePage);
    return SidePage;
    var _a;
}());
exports.SidePage = SidePage;
var E2EPage = (function () {
    function E2EPage(navCtrl, menuCtrl) {
        this.navCtrl = navCtrl;
        this.menuCtrl = menuCtrl;
    }
    E2EPage.prototype.push = function () {
        this.navCtrl.push(E2EPage);
    };
    E2EPage = __decorate([
        core_1.Component({
            template: "\n  <ion-header>\n    <ion-navbar>\n      <button ion-button menuToggle>\n        <ion-icon name=\"menu\"></ion-icon>\n      </button>\n      <ion-title>Navigation</ion-title>\n    </ion-navbar>\n  </ion-header>\n  <ion-content padding>\n    <button ion-button (click)=\"push()\">Push</button>\n    <div f></div>\n    <div f></div>\n    <div f></div>\n    <div f></div>\n\n  </ion-content>\n  "
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
        this.root2 = SidePage;
    }
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
                SidePage,
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
                SidePage,
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;