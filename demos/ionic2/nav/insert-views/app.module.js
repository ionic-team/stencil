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
var FirstPage = (function () {
    function FirstPage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    FirstPage.prototype.pushPage = function () {
        this.navCtrl.push(SecondPage);
    };
    FirstPage = __decorate([
        core_1.Component({
            template: "\n    <ion-header>\n      <ion-navbar>\n        <ion-title>Root</ion-title>\n      </ion-navbar>\n    </ion-header>\n\n    <ion-content padding>\n      <button ion-button block (click)=\"pushPage()\">Push Page</button>\n    </ion-content>",
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _a) || Object])
    ], FirstPage);
    return FirstPage;
    var _a;
}());
exports.FirstPage = FirstPage;
var SecondPage = (function () {
    function SecondPage(navCtrl) {
        this.navCtrl = navCtrl;
        this._index = 0;
    }
    SecondPage.prototype.insertPage = function () {
        var _this = this;
        this.navCtrl.insert(1, InsertPage, {
            index: this._index++
        }).then(function () {
            console.log('INSERTED! Stack:\n', _this.navCtrl.getViews());
        });
    };
    SecondPage.prototype.removePage = function () {
        var _this = this;
        this.navCtrl.remove(1, 1).then(function () {
            console.log('REMOVED! Stack:\n', _this.navCtrl.getViews());
        });
    };
    SecondPage.prototype.removeTwoPages = function () {
        var _this = this;
        this.navCtrl.remove(this.navCtrl.length() - 2, 2).then(function () {
            console.log('REMOVED TWO! Stack:\n', _this.navCtrl.getViews());
        });
    };
    SecondPage.prototype.testThing = function () {
        var _this = this;
        console.log('TEST THING');
        this.navCtrl.push(InsertPage).then(function () {
            console.log('Pushed', _this.navCtrl.getViews());
            console.log('Removing', _this.navCtrl.getActive().index - 1);
            _this.navCtrl.remove(_this.navCtrl.getActive().index - 1, 1);
            console.log('REMOVED! Stack:\n', _this.navCtrl.getViews());
        });
    };
    SecondPage = __decorate([
        core_1.Component({
            template: "\n    <ion-header>\n      <ion-navbar>\n        <ion-title>Root</ion-title>\n      </ion-navbar>\n    </ion-header>\n\n    <ion-content padding>\n      <h1>Second page</h1>\n      <button ion-button block (click)=\"insertPage()\">Insert Page</button>\n      <button ion-button block (click)=\"removePage()\">Remove Page</button>\n      <button ion-button block (click)=\"removeTwoPages()\">Remove Two Pages</button>\n      <button ion-button block (click)=\"testThing()\">Test Thing</button>\n    </ion-content>\n  "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _a) || Object])
    ], SecondPage);
    return SecondPage;
    var _a;
}());
exports.SecondPage = SecondPage;
var InsertPage = (function () {
    function InsertPage(params) {
        this.index = params.get('index');
    }
    InsertPage = __decorate([
        core_1.Component({
            template: "\n    <ion-header>\n      <ion-navbar>\n        <ion-title>Inserted Paged {{index}}</ion-title>\n      </ion-navbar>\n    </ion-header>\n    <ion-content padding>\n      Inserted Page\n    </ion-content>\n  "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.NavParams !== 'undefined' && ionic_angular_1.NavParams) === 'function' && _a) || Object])
    ], InsertPage);
    return InsertPage;
    var _a;
}());
exports.InsertPage = InsertPage;
var E2EApp = (function () {
    function E2EApp() {
        this.root = FirstPage;
    }
    E2EApp = __decorate([
        core_1.Component({
            template: "<ion-nav [root]=\"root\"></ion-nav>"
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
                FirstPage,
                SecondPage,
                InsertPage
            ],
            imports: [
                ionic_angular_1.IonicModule.forRoot(E2EApp)
            ],
            bootstrap: [ionic_angular_1.IonicApp],
            entryComponents: [
                E2EApp,
                FirstPage,
                SecondPage,
                InsertPage
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;