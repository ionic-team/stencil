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
var forms_1 = require('@angular/forms');
var E2EPage = (function () {
    function E2EPage(alertCtrl, navCtrl) {
        this.alertCtrl = alertCtrl;
        this.navCtrl = navCtrl;
    }
    E2EPage.prototype.ionViewDidEnter = function () {
        var alert = this.alertCtrl.create({
            title: 'Alert!',
            message: 'I was opened in ionViewDidEnter',
            buttons: ['Ok']
        });
        alert.present();
    };
    E2EPage.prototype.submit = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: 'Not logged in',
            message: 'Sign in to continue.',
            buttons: [
                {
                    text: 'Sign in',
                    handler: function () {
                        console.log('Sign in');
                    }
                }
            ]
        });
        alert.onDidDismiss(function () {
            console.log('dismiss');
            _this.navCtrl.push(AnotherPage);
        });
        alert.present();
    };
    E2EPage = __decorate([
        core_1.Component({
            templateUrl: 'main.html'
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.AlertController !== 'undefined' && ionic_angular_1.AlertController) === 'function' && _a) || Object, (typeof (_b = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _b) || Object])
    ], E2EPage);
    return E2EPage;
    var _a, _b;
}());
exports.E2EPage = E2EPage;
var AnotherPage = (function () {
    function AnotherPage(navCtrl, alertCtrl, loadingCtrl, builder) {
        this.navCtrl = navCtrl;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.builder = builder;
        this.form = builder.group({
            firstName: builder.control('', forms_1.Validators.compose([
                forms_1.Validators.required,
                forms_1.Validators.minLength(5)
            ]))
        });
    }
    AnotherPage.prototype.submit = function (value) {
        if (this.form.valid) {
            console.log(value);
        }
        else {
            this.alertCtrl.create({
                title: 'Invalid input data',
                subTitle: 'Please correct the errors and resubmit the data.',
                buttons: ['OK']
            }).present();
        }
    };
    AnotherPage.prototype.ionViewDidEnter = function () {
        this.showConfirm();
    };
    AnotherPage.prototype.showConfirm = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: "Hi there",
            buttons: [
                {
                    text: 'Go Back',
                    role: 'cancel',
                    handler: function () {
                        alert.dismiss().then(function () {
                            _this.navCtrl.pop();
                        });
                        return false;
                    }
                },
                {
                    text: 'Stay Here',
                    handler: function () {
                        console.log('Stay Here');
                    }
                }
            ]
        });
        alert.present();
    };
    AnotherPage.prototype.doFastPop = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: 'Async Nav Transition',
            message: 'This is an example of dismissing an alert, then quickly starting another transition on the same nav controller.',
            buttons: [{
                    text: 'Ok',
                    handler: function () {
                        // present a loading indicator
                        var loading = _this.loadingCtrl.create({
                            content: 'Loading...'
                        });
                        loading.present();
                        // start an async operation
                        setTimeout(function () {
                            // the async operation has completed
                            // dismiss the loading indicator
                            loading.dismiss();
                            // begin dismissing the alert
                            alert.dismiss().then(function () {
                                // after the alert has been dismissed
                                // then you can do another nav transition
                                _this.navCtrl.pop();
                            });
                        }, 100);
                        // return false so the alert doesn't automatically
                        // dismissed itself. Instead we're manually
                        // handling the dismiss logic above so that we
                        // can wait for the alert to finish it's dismiss
                        // transition before starting another nav transition
                        // on the same nav controller
                        return false;
                    }
                }]
        });
        alert.present();
    };
    AnotherPage = __decorate([
        core_1.Component({
            template: "\n    <ion-header>\n      <ion-navbar>\n        <ion-title>Another Page</ion-title>\n      </ion-navbar>\n    </ion-header>\n    <ion-content padding>\n      <form [formGroup]=\"form\" (ngSubmit)=\"submit(form.value)\">\n        <ion-list>\n          <ion-item>\n            <ion-label>Name</ion-label>\n            <ion-input name=\"firstName\" type=\"text\"></ion-input>\n          </ion-item>\n        </ion-list>\n        <div padding style=\"padding-top: 0 !important;\">\n          <button ion-button list-item color=\"primary\" block>\n            Submit\n          </button>\n        </div>\n      </form>\n      <p>\n        <button ion-button block (click)=\"doFastPop()\">Fast Loading Dismiss, Nav Pop</button>\n      </p>\n    </ion-content>\n  "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _a) || Object, (typeof (_b = typeof ionic_angular_1.AlertController !== 'undefined' && ionic_angular_1.AlertController) === 'function' && _b) || Object, (typeof (_c = typeof ionic_angular_1.LoadingController !== 'undefined' && ionic_angular_1.LoadingController) === 'function' && _c) || Object, (typeof (_d = typeof forms_1.FormBuilder !== 'undefined' && forms_1.FormBuilder) === 'function' && _d) || Object])
    ], AnotherPage);
    return AnotherPage;
    var _a, _b, _c, _d;
}());
exports.AnotherPage = AnotherPage;
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
                E2EPage,
                AnotherPage
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;