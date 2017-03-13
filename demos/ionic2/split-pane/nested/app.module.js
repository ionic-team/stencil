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
var E2ENested = (function () {
    function E2ENested(navCtrl) {
        this.navCtrl = navCtrl;
    }
    E2ENested.prototype.push = function () {
        this.navCtrl.push(E2ENested);
    };
    E2ENested = __decorate([
        core_1.Component({
            template: "\n  <ion-header>\n    <ion-navbar><ion-title>Nested 1</ion-title></ion-navbar>\n  </ion-header>\n  <ion-content padding>\n    <button ion-button (click)=\"push()\">Push</button>\n    <div f></div>\n    <div f></div>\n    <div f></div>\n    <div f></div>\n  </ion-content>\n  "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _a) || Object])
    ], E2ENested);
    return E2ENested;
    var _a;
}());
exports.E2ENested = E2ENested;
var E2ENested2 = (function () {
    function E2ENested2(navCtrl) {
        this.navCtrl = navCtrl;
    }
    E2ENested2.prototype.push = function () {
        this.navCtrl.push(E2ENested2);
    };
    E2ENested2 = __decorate([
        core_1.Component({
            template: "\n  <ion-header>\n    <ion-navbar><ion-title>Nested 2</ion-title></ion-navbar>\n  </ion-header>\n  <ion-content padding>\n    <button ion-button (click)=\"push()\">Push</button>\n    <div f></div>\n    <div f></div>\n    <div f></div>\n    <div f></div>\n  </ion-content>\n  "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _a) || Object])
    ], E2ENested2);
    return E2ENested2;
    var _a;
}());
exports.E2ENested2 = E2ENested2;
var E2ENested3 = (function () {
    function E2ENested3(navCtrl) {
        this.navCtrl = navCtrl;
    }
    E2ENested3.prototype.push = function () {
        this.navCtrl.push(E2ENested3);
    };
    E2ENested3 = __decorate([
        core_1.Component({
            template: "\n  <ion-header>\n    <ion-navbar>\n      <button ion-button menuToggle>\n        <ion-icon name=\"menu\"></ion-icon>\n      </button>\n      <ion-title>Nested 3</ion-title>\n    </ion-navbar>\n  </ion-header>\n  <ion-content padding>\n    <button ion-button (click)=\"push()\">Push</button>\n    <div f></div>\n    <div f></div>\n    <div f></div>\n    <div f></div>\n  </ion-content>\n  "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _a) || Object])
    ], E2ENested3);
    return E2ENested3;
    var _a;
}());
exports.E2ENested3 = E2ENested3;
var SidePage = (function () {
    function SidePage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    SidePage.prototype.push = function () {
        this.navCtrl.push(SidePage);
    };
    SidePage = __decorate([
        core_1.Component({
            template: "\n  <ion-header>\n  <ion-navbar><ion-title>Navigation</ion-title></ion-navbar>\n  </ion-header>\n  <ion-content>\n  <ion-list>\n    <ion-item>Hola</ion-item>\n    <ion-item>Hola</ion-item>\n    <ion-item>Hola</ion-item>\n    <button ion-item (click)=\"push()\">Push</button>\n    <ion-item>Hola</ion-item>\n    <ion-item>Hola</ion-item>\n    <ion-item>Hola</ion-item>\n\n  </ion-list>\n  </ion-content>\n  "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _a) || Object])
    ], SidePage);
    return SidePage;
    var _a;
}());
exports.SidePage = SidePage;
var E2EPage = (function () {
    function E2EPage() {
        this.root = E2ENested;
        this.root2 = E2ENested2;
        this.root3 = E2ENested3;
    }
    E2EPage = __decorate([
        core_1.Component({
            template: "\n<ion-split-pane>\n  <ion-nav [root]=\"root\"></ion-nav>\n\n  <ion-split-pane when=\"lg\" main >\n    <ion-nav [root]=\"root2\"></ion-nav>\n    <ion-nav [root]=\"root3\" main ></ion-nav>\n  </ion-split-pane>\n\n</ion-split-pane>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], E2EPage);
    return E2EPage;
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
                E2ENested,
                E2ENested2,
                E2ENested3
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
                E2ENested,
                E2ENested2,
                E2ENested3
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;