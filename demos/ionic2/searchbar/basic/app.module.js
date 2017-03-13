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
    function E2EPage(changeDetectorRef) {
        this.changeDetectorRef = changeDetectorRef;
        this.defaultSearch = 'test';
        this.customPlaceholder = 2;
        this.defaultCancel = '';
        this.isAutocorrect = 'on';
        this.isAutocomplete = 'on';
        this.isSpellcheck = true;
    }
    E2EPage.prototype.onClearSearchbar = function (ev) {
        console.log('ionClear', ev.target.value);
    };
    E2EPage.prototype.onCancelSearchbar = function (ev) {
        console.log('ionCancel', ev.target.value);
    };
    E2EPage.prototype.triggerInput = function (ev) {
        console.log('ionInput', ev.target.value);
    };
    E2EPage.prototype.inputBlurred = function (ev) {
        console.log('ionBlur', ev.target.value);
    };
    E2EPage.prototype.inputFocused = function (ev) {
        console.log('ionFocus', ev.target.value);
    };
    E2EPage.prototype.ngAfterViewInit = function () {
        this.customPlaceholder = 33;
        this.defaultCancel = 'after view';
        this.changeDetectorRef.detectChanges();
    };
    E2EPage.prototype.changeValue = function () {
        this.defaultSearch = 'changed';
    };
    E2EPage = __decorate([
        core_1.Component({
            templateUrl: 'main.html'
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof core_1.ChangeDetectorRef !== 'undefined' && core_1.ChangeDetectorRef) === 'function' && _a) || Object])
    ], E2EPage);
    return E2EPage;
    var _a;
}());
exports.E2EPage = E2EPage;
var E2EApp = (function () {
    function E2EApp() {
        this.root = E2EPage;
    }
    E2EApp = __decorate([
        core_1.Component({
            template: '<ion-nav [root]="root"></ion-nav>'
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
                E2EApp,
                E2EPage
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;