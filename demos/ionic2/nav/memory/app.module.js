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
var delay = 100;
var animate = false;
var count = 0;
var Page1 = (function () {
    function Page1(nav) {
        this.nav = nav;
    }
    Page1.prototype.play = function () {
        var _this = this;
        this.tmr = setTimeout(function () {
            count++;
            console.log('push', count);
            _this.nav.push(Page2, null, {
                animate: animate
            });
        }, delay);
    };
    Page1.prototype.ionViewDidEnter = function () {
        this.play();
    };
    Page1.prototype.stop = function () {
        clearTimeout(this.tmr);
    };
    Page1 = __decorate([
        core_1.Component({
            template: "\n    <ion-content padding text-center>\n      <p>Page 1</p>\n      <button ion-button (click)=\"stop()\">Stop</button>\n      <button ion-button (click)=\"play()\">Play</button>\n    </ion-content>\n  "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _a) || Object])
    ], Page1);
    return Page1;
    var _a;
}());
exports.Page1 = Page1;
var Page2 = (function () {
    function Page2(navCtrl) {
        this.navCtrl = navCtrl;
    }
    Page2.prototype.play = function () {
        var _this = this;
        this.tmr = setTimeout(function () {
            count++;
            console.log('pop', count);
            _this.navCtrl.pop({
                animate: animate
            });
        }, delay);
    };
    Page2.prototype.ionViewDidEnter = function () {
        this.play();
    };
    Page2.prototype.stop = function () {
        clearTimeout(this.tmr);
    };
    Page2 = __decorate([
        core_1.Component({
            template: "\n    <ion-content padding text-center>\n      <p>Page 2</p>\n      <button ion-button (click)=\"stop()\">Stop</button>\n      <button ion-button (click)=\"play()\">Play</button>\n    </ion-content>\n  "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _a) || Object])
    ], Page2);
    return Page2;
    var _a;
}());
exports.Page2 = Page2;
var E2EApp = (function () {
    function E2EApp() {
        this.root = Page1;
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