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
    function E2EPage() {
        this.showIf = true;
        this.liked = false;
        this.buttons = [
            { selected: false, value: 'primary', text: 'Primary' },
            { selected: false, value: 'secondary', text: 'Secondary' },
            { selected: false, value: 'dark', text: 'Dark' }
        ];
        this.reset();
    }
    E2EPage.prototype.unify = function () {
        this.isDestructive = false;
        this.isSecondary = false;
        this.isCustom = false;
        this.isSolid = false;
        this.isOutline = false;
        this.isClear = false;
        this.isClicked = false;
        this.myColor1 = 'primary';
        this.myColor2 = 'primary';
    };
    E2EPage.prototype.reset = function () {
        this.isDestructive = true;
        this.isSecondary = true;
        this.isCustom = true;
        this.isSolid = true;
        this.isOutline = true;
        this.isClear = true;
        this.isClicked = false;
        this.myColor1 = 'custom1';
        this.myColor2 = 'custom2';
    };
    E2EPage.prototype.toggle = function () {
        this.isClicked = !this.isClicked;
    };
    E2EPage.prototype.reportLike = function (liked) {
        this.liked = liked;
    };
    E2EPage.prototype.setValue = function (value) {
        if (this.value !== value) {
            this.buttons.forEach(function (btn) { return btn.selected = (value === btn.value); });
            this.value = value;
        }
    };
    E2EPage = __decorate([
        core_1.Component({
            templateUrl: 'main.html'
        }), 
        __metadata('design:paramtypes', [])
    ], E2EPage);
    return E2EPage;
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