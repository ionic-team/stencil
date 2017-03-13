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
    E2EPage.prototype.presentLoadingIos = function () {
        var loading = this.loadingCtrl.create({
            spinner: 'ios',
            duration: 1000,
            cssClass: 'my-custom-loader'
        });
        loading.onDidDismiss(function () {
            console.log('Dismissed loading');
        });
        loading.present();
    };
    E2EPage.prototype.presentLoadingDots = function () {
        var loading = this.loadingCtrl.create({
            spinner: 'dots',
            content: 'Loading...',
            duration: 1000
        });
        loading.present();
    };
    E2EPage.prototype.presentLoadingBubbles = function () {
        var loading = this.loadingCtrl.create({
            spinner: 'bubbles',
            content: 'Loading...',
            duration: 1000
        });
        loading.present();
    };
    E2EPage.prototype.presentLoadingCircles = function () {
        var loading = this.loadingCtrl.create({
            spinner: 'circles',
            content: 'Loading...',
            duration: 1000
        });
        loading.present();
    };
    E2EPage.prototype.presentLoadingCrescent = function () {
        this.loadingCtrl.create()
            .setSpinner('crescent')
            .setContent('Please wait...')
            .setDuration(1000)
            .present();
    };
    // Pass the fixed-spinner class so we can turn off
    // spinner animation for the e2e test
    E2EPage.prototype.presentLoadingDefault = function () {
        var loading = this.loadingCtrl.create({
            content: 'Please wait...',
            cssClass: 'fixed-spinner spinner-class'
        });
        loading.present();
        setTimeout(function () {
            loading.dismiss();
        }, 5000);
    };
    E2EPage.prototype.presentLoadingCustom = function () {
        var loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: "\n        <div class=\"custom-spinner-container\">\n          <div class=\"custom-spinner-box\"></div>\n        </div>"
        });
        loading.present();
        setTimeout(function () {
            loading.setContent('Loaded!');
        }, 1000);
        setTimeout(function () {
            loading.dismiss();
        }, 2000);
    };
    E2EPage.prototype.presentLoadingText = function () {
        var _this = this;
        var loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: 'Loading Please Wait...'
        });
        loading.present();
        setTimeout(function () {
            _this.navCtrl.push(Page2);
        }, 1000);
        setTimeout(function () {
            loading.dismiss();
        }, 5000);
    };
    E2EPage.prototype.goToPage2 = function () {
        this.navCtrl.push(Page2);
    };
    E2EPage.prototype.presentLoadingMultiple = function () {
        var loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: 'Loading 1 Please Wait...'
        });
        loading.present();
        var loading2 = this.loadingCtrl.create({
            spinner: 'hide',
            content: 'Loading 2 Please Wait...'
        });
        setTimeout(function () {
            loading2.present();
        }, 1000);
        var loading3 = this.loadingCtrl.create()
            .setSpinner('hide')
            .setContent('Loading 3 Please Wait...');
        setTimeout(function () {
            loading3.present();
            loading3.dismiss();
            loading2.dismiss();
            loading.dismiss();
        }, 2000);
    };
    E2EPage.prototype.presentLoadingMultipleNav = function () {
        var _this = this;
        this.loadingCtrl.create({
            spinner: 'hide',
            content: 'Loading 1 Please Wait...',
            dismissOnPageChange: true
        }).present();
        setTimeout(function () {
            _this.loadingCtrl.create({
                spinner: 'hide',
                content: 'Loading 2 Please Wait...',
                dismissOnPageChange: true
            }).present();
            _this.navCtrl.push(Page2);
        }, 500);
    };
    E2EPage.prototype.presentLoadingDismissNav = function () {
        var _this = this;
        this.loadingCtrl.create({
            spinner: 'hide',
            content: 'Loading 1 Please Wait...',
            dismissOnPageChange: true
        }).present();
        setTimeout(function () {
            _this.navCtrl.push(Page2);
        }, 500);
    };
    E2EPage.prototype.presentLoadingOpenDismiss = function () {
        // debugger;
        var loading = this.loadingCtrl.create({
            content: 'Loading 1'
        });
        loading.present();
        loading.dismiss();
        var loading2 = this.loadingCtrl.create({
            content: 'Loading 2'
        });
        loading2.present();
        loading2.dismiss();
    };
    E2EPage = __decorate([
        core_1.Component({
            templateUrl: 'main.html',
            styles: [
                "\n    /* Fix the spinner used in e2e */\n    .fixed-spinner svg {\n      animation: none;\n    }\n    ",
                "\n    .custom-spinner-container {\n      position: relative;\n      display: inline-block;\n      box-sizing: border-box;\n    }\n    ",
                "\n    .custom-spinner-box {\n      position: relative;\n      box-sizing: border-box;\n      border: 4px solid #000;\n      width: 60px;\n      height: 60px;\n      animation: spin 3s infinite linear;\n    }\n    ",
                "\n    .custom-spinner-box:before {\n      content: '';\n      position: absolute;\n      top: 50%;\n      left: 50%;\n      transform: translate(-50%, -50%);\n      box-sizing: border-box;\n      border: 4px solid #000;\n      width: 40px;\n      height: 40px;\n      animation: pulse 1.5s infinite ease;\n    }\n    ",
                "\n    .wp .custom-spinner-box,\n    .wp .custom-spinner-box:before {\n      border-color: #fff;\n    }\n    ",
                "\n    @-webkit-keyframes pulse {\n      50% {\n        border-width: 20px;\n      }\n    }\n    ",
                "\n    @keyframes pulse {\n      50% {\n        border-width: 20px;\n      }\n    }\n    ",
                "\n    @-webkit-keyframes spin {\n      100% {\n        -webkit-transform: rotate(360deg);\n                transform: rotate(360deg);\n      }\n    }\n    ",
                "@keyframes spin {\n      100% {\n        -webkit-transform: rotate(360deg);\n                transform: rotate(360deg);\n      }\n    }"
            ]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.LoadingController !== 'undefined' && ionic_angular_1.LoadingController) === 'function' && _a) || Object, (typeof (_b = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _b) || Object])
    ], E2EPage);
    return E2EPage;
    var _a, _b;
}());
exports.E2EPage = E2EPage;
var Page2 = (function () {
    function Page2(navCtrl) {
        this.navCtrl = navCtrl;
    }
    Page2.prototype.goToPage3 = function () {
        this.navCtrl.push(Page3);
    };
    Page2 = __decorate([
        core_1.Component({
            template: "\n    <ion-header>\n      <ion-navbar>\n        <ion-title>Page 2</ion-title>\n      </ion-navbar>\n    </ion-header>\n    <ion-content padding>Some content</ion-content>\n    <ion-footer>\n      <ion-toolbar>\n        <ion-buttons end>\n          <button ion-button icon-right (click)=\"goToPage3()\">\n            Navigate\n            <ion-icon name=\"arrow-forward\"></ion-icon>\n          </button>\n        </ion-buttons>\n      </ion-toolbar>\n    </ion-footer>\n  "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _a) || Object])
    ], Page2);
    return Page2;
    var _a;
}());
exports.Page2 = Page2;
var Page3 = (function () {
    function Page3() {
    }
    Page3 = __decorate([
        core_1.Component({
            template: "\n    <ion-header>\n      <ion-navbar>\n        <ion-title>Page 3</ion-title>\n      </ion-navbar>\n    </ion-header>\n    <ion-content padding>Some content</ion-content>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], Page3);
    return Page3;
}());
exports.Page3 = Page3;
var E2EApp = (function () {
    function E2EApp(app) {
        this.root = E2EPage;
        app.viewDidLeave.subscribe(function (ev) {
            console.log('App didLeave');
        });
        app.viewWillLeave.subscribe(function (ev) {
            console.log('App willLeave');
        });
    }
    E2EApp = __decorate([
        core_1.Component({
            template: "\n    <ion-nav [root]=\"root\"></ion-nav>\n  ",
            encapsulation: core_1.ViewEncapsulation.None
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.App !== 'undefined' && ionic_angular_1.App) === 'function' && _a) || Object])
    ], E2EApp);
    return E2EApp;
    var _a;
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
                Page2,
                Page3
            ],
            imports: [
                ionic_angular_1.IonicModule.forRoot(E2EApp)
            ],
            bootstrap: [ionic_angular_1.IonicApp],
            entryComponents: [
                E2EApp,
                E2EPage,
                Page2,
                Page3
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;