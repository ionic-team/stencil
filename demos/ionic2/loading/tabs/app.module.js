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
    function E2EPage(loadingCtrl, navCtrl) {
        this.loadingCtrl = loadingCtrl;
        this.navCtrl = navCtrl;
    }
    E2EPage.prototype.presentLoading = function () {
        var loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: 'Loading...',
            duration: 1000
        });
        loading.present();
    };
    E2EPage.prototype.presentLoadingNav = function () {
        var _this = this;
        var loading = this.loadingCtrl.create({
            content: 'Please wait...',
        });
        loading.present();
        setTimeout(function () {
            _this.navCtrl.push(Page2);
            setTimeout(function () {
                loading.dismiss();
            }, 1000);
        }, 1000);
    };
    E2EPage = __decorate([
        core_1.Component({
            templateUrl: 'main.html'
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.LoadingController !== 'undefined' && ionic_angular_1.LoadingController) === 'function' && _a) || Object, (typeof (_b = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _b) || Object])
    ], E2EPage);
    return E2EPage;
    var _a, _b;
}());
exports.E2EPage = E2EPage;
var Page2 = (function () {
    function Page2() {
    }
    Page2 = __decorate([
        core_1.Component({
            template: "\n    <ion-header>\n      <ion-navbar>\n        <ion-title>Page 2</ion-title>\n      </ion-navbar>\n    </ion-header>\n    <ion-content padding>Some content</ion-content>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], Page2);
    return Page2;
}());
exports.Page2 = Page2;
var TabsPage = (function () {
    function TabsPage() {
        this.root1 = E2EPage;
        this.root2 = Page2;
        this.root3 = E2EPage;
    }
    TabsPage = __decorate([
        core_1.Component({
            template: "\n    <ion-tabs>\n      <ion-tab tabTitle=\"Plain List\" tabIcon=\"star\" [root]=\"root1\"></ion-tab>\n      <ion-tab tabTitle=\"Schedule\" tabIcon=\"globe\" [root]=\"root2\"></ion-tab>\n      <ion-tab tabTitle=\"Stopwatch\" tabIcon=\"stopwatch\" [root]=\"root3\"></ion-tab>\n    </ion-tabs>\n  "
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
                E2EPage,
                TabsPage,
                Page2
            ],
            imports: [
                ionic_angular_1.IonicModule.forRoot(E2EApp)
            ],
            bootstrap: [ionic_angular_1.IonicApp],
            entryComponents: [
                E2EApp,
                E2EPage,
                TabsPage,
                Page2
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;