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
var Page1 = (function () {
    function Page1() {
    }
    Page1 = __decorate([
        core_1.Component({
            templateUrl: 'page1.html'
        }), 
        __metadata('design:paramtypes', [])
    ], Page1);
    return Page1;
}());
exports.Page1 = Page1;
var Page2 = (function () {
    function Page2() {
    }
    Page2 = __decorate([
        core_1.Component({
            templateUrl: 'page2.html'
        }), 
        __metadata('design:paramtypes', [])
    ], Page2);
    return Page2;
}());
exports.Page2 = Page2;
var E2EApp = (function () {
    function E2EApp(app, menuCtrl) {
        this.app = app;
        this.menuCtrl = menuCtrl;
        this.page1 = Page1;
        this.page2 = Page2;
        this.rootPage = Page1;
        this.menu1Active();
    }
    E2EApp.prototype.openPage = function (p) {
        // Get the <ion-nav> by id
        this.nav.setRoot(p);
    };
    E2EApp.prototype.menu1Active = function () {
        this.menuCtrl.enable(true, 'menu1');
    };
    E2EApp.prototype.menu2Active = function () {
        this.menuCtrl.enable(true, 'menu2');
    };
    E2EApp.prototype.menu3Active = function () {
        this.menuCtrl.enable(true, 'menu3');
    };
    __decorate([
        core_1.ViewChild(ionic_angular_1.Nav), 
        __metadata('design:type', (typeof (_a = typeof ionic_angular_1.Nav !== 'undefined' && ionic_angular_1.Nav) === 'function' && _a) || Object)
    ], E2EApp.prototype, "nav", void 0);
    E2EApp = __decorate([
        core_1.Component({
            templateUrl: 'main.html'
        }), 
        __metadata('design:paramtypes', [(typeof (_b = typeof ionic_angular_1.App !== 'undefined' && ionic_angular_1.App) === 'function' && _b) || Object, (typeof (_c = typeof ionic_angular_1.MenuController !== 'undefined' && ionic_angular_1.MenuController) === 'function' && _c) || Object])
    ], E2EApp);
    return E2EApp;
    var _a, _b, _c;
}());
exports.E2EApp = E2EApp;
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                E2EApp,
                Page1,
                Page2
            ],
            imports: [
                ionic_angular_1.IonicModule.forRoot(E2EApp)
            ],
            bootstrap: [ionic_angular_1.IonicApp],
            entryComponents: [
                E2EApp,
                Page1,
                Page2
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;