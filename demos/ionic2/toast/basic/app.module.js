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
var AnotherPage = (function () {
    function AnotherPage() {
    }
    AnotherPage = __decorate([
        core_1.Component({
            template: "\n    <ion-header>\n      <ion-navbar>\n        <ion-title>Another Page</ion-title>\n      </ion-navbar>\n    </ion-header>\n    <ion-content padding>\n      <p>This is another page to show that the toast stays.</p>\n    </ion-content>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], AnotherPage);
    return AnotherPage;
}());
exports.AnotherPage = AnotherPage;
var E2EPage = (function () {
    function E2EPage(toastCtrl, navCtrl) {
        this.toastCtrl = toastCtrl;
        this.navCtrl = navCtrl;
    }
    E2EPage.prototype.showToast = function () {
        var _this = this;
        var toast = this.toastCtrl.create({
            message: 'User was created successfully'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
        setTimeout(function () {
            _this.navCtrl.push(AnotherPage);
        }, 1000);
        setTimeout(function () {
            toast.dismiss();
        }, 2000);
    };
    E2EPage.prototype.showLongToast = function () {
        var toast = this.toastCtrl.create()
            .setMessage('Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea voluptatibus quibusdam eum nihil optio, ullam accusamus magni, nobis suscipit reprehenderit, sequi quam amet impedit. Accusamus dolorem voluptates laborum dolor obcaecati.')
            .setDuration(5000)
            .setCssClass('custom-class my-toast');
        toast.onDidDismiss(this.dismissHandler);
        toast.present();
    };
    E2EPage.prototype.showDismissDurationToast = function () {
        var toast = this.toastCtrl.create({
            message: 'I am dismissed after 1.5 seconds',
            duration: 1500
        });
        toast.onDidDismiss(this.dismissHandler);
        toast.present();
    };
    E2EPage.prototype.showToastWithCloseButton = function (positionString) {
        var toast = this.toastCtrl.create({
            message: 'Your internet connection appears to be offline. Data integrity is not gauranteed.',
            showCloseButton: true,
            closeButtonText: 'Ok',
            position: positionString
        });
        toast.onDidDismiss(this.dismissHandler);
        toast.present();
    };
    E2EPage.prototype.showDismissPageChangeToast = function () {
        var _this = this;
        var toast = this.toastCtrl.create({
            message: 'I am dismissed on page change',
            dismissOnPageChange: true
        });
        toast.onDidDismiss(this.dismissHandler);
        toast.present();
        setTimeout(function () {
            _this.navCtrl.push(AnotherPage);
        }, 1000);
    };
    E2EPage.prototype.dismissHandler = function (toast) {
        console.info('Toast onDidDismiss()');
    };
    E2EPage = __decorate([
        core_1.Component({
            templateUrl: 'main.html'
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.ToastController !== 'undefined' && ionic_angular_1.ToastController) === 'function' && _a) || Object, (typeof (_b = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _b) || Object])
    ], E2EPage);
    return E2EPage;
    var _a, _b;
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
                E2EPage,
                AnotherPage
            ],
            imports: [
                ionic_angular_1.IonicModule.forRoot(E2EApp)
            ],
            bootstrap: [ionic_angular_1.IonicApp],
            entryComponents: [
                E2EApp,
                E2EPage,
                AnotherPage
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;