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
//
// Tab 1
//
var Tab1 = (function () {
    function Tab1(alertCtrl, navCtrl) {
        this.alertCtrl = alertCtrl;
        this.navCtrl = navCtrl;
        this.called = {
            ionViewCanEnter: 0,
            ionViewCanLeave: 0,
            ionViewWillLoad: 0,
            ionViewDidLoad: 0,
            ionViewWillEnter: 0,
            ionViewDidEnter: 0,
            ionViewWillLeave: 0,
            ionViewDidLeave: 0
        };
    }
    Tab1.prototype.push = function () {
        this.navCtrl.push(Tab1);
    };
    Tab1.prototype.openAlert = function () {
        this.alertCtrl.create({
            title: 'Example'
        }).present();
    };
    Tab1.prototype.ionViewCanEnter = function () {
        this.called.ionViewCanEnter++;
        return true;
    };
    Tab1.prototype.ionViewCanLeave = function () {
        this.called.ionViewCanLeave++;
        return true;
    };
    Tab1.prototype.ionViewWillLoad = function () {
        this.called.ionViewWillLoad++;
    };
    Tab1.prototype.ionViewDidLoad = function () {
        this.called.ionViewDidLoad++;
    };
    Tab1.prototype.ionViewWillEnter = function () {
        this.called.ionViewWillEnter++;
    };
    Tab1.prototype.ionViewDidEnter = function () {
        this.called.ionViewDidEnter++;
    };
    Tab1.prototype.ionViewWillLeave = function () {
        this.called.ionViewWillLeave++;
    };
    Tab1.prototype.ionViewDidLeave = function () {
        this.called.ionViewDidLeave++;
    };
    Tab1 = __decorate([
        core_1.Component({
            template: "\n    <ion-header>\n      <ion-navbar>\n        <ion-title>Lifecyles</ion-title>\n      </ion-navbar>\n    </ion-header>\n\n    <ion-content padding>\n      <p>ionViewCanEnter ({{called.ionViewCanEnter}})</p>\n      <p>ionViewCanLeave ({{called.ionViewCanLeave}})</p>\n      <p>ionViewWillLoad ({{called.ionViewWillLoad}})</p>\n      <p>ionViewDidLoad ({{called.ionViewDidLoad}})</p>\n      <p>ionViewWillEnter ({{called.ionViewWillEnter}})</p>\n      <p>ionViewDidEnter ({{called.ionViewDidEnter}})</p>\n      <p>ionViewWillLeave ({{called.ionViewWillLeave}})</p>\n      <p>ionViewDidLeave ({{called.ionViewDidLeave}})</p>\n\n      <button ion-button (click)=\"push()\">push()</button>\n      <button ion-button (click)=\"openAlert()\">open alert</button>\n    </ion-content>\n    "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.AlertController !== 'undefined' && ionic_angular_1.AlertController) === 'function' && _a) || Object, (typeof (_b = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _b) || Object])
    ], Tab1);
    return Tab1;
    var _a, _b;
}());
exports.Tab1 = Tab1;
var TabsPage = (function () {
    function TabsPage() {
        this.root = Tab1;
    }
    TabsPage = __decorate([
        core_1.Component({
            template: "\n    <ion-tabs>\n      <ion-tab tabTitle=\"Plain List\" tabIcon=\"star\" [root]=\"root\"></ion-tab>\n      <ion-tab tabTitle=\"Schedule\" tabIcon=\"globe\" [root]=\"root\"></ion-tab>\n      <ion-tab tabTitle=\"Stopwatch\" tabIcon=\"logo-facebook\" [root]=\"root\"></ion-tab>\n    </ion-tabs>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], TabsPage);
    return TabsPage;
}());
exports.TabsPage = TabsPage;
var E2EApp = (function () {
    function E2EApp() {
        this.root = TabsPage;
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
                Tab1,
                TabsPage
            ],
            imports: [
                ionic_angular_1.IonicModule.forRoot(E2EApp, {
                    tabsHighlight: true,
                })
            ],
            bootstrap: [ionic_angular_1.IonicApp],
            entryComponents: [
                E2EApp,
                Tab1,
                TabsPage
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;