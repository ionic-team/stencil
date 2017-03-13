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
var SegmentPage = (function () {
    function SegmentPage(navCtrl) {
        this.navCtrl = navCtrl;
        this.signInType = 'new';
    }
    SegmentPage.prototype.goToPage2 = function () {
        this.navCtrl.push(SegmentPage2);
    };
    SegmentPage = __decorate([
        core_1.Component({
            templateUrl: 'main.html',
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _a) || Object])
    ], SegmentPage);
    return SegmentPage;
    var _a;
}());
exports.SegmentPage = SegmentPage;
var SegmentPage2 = (function () {
    function SegmentPage2() {
    }
    SegmentPage2 = __decorate([
        core_1.Component({
            template: "\n    <ion-header>\n      <ion-navbar hideBackButton>\n        <button ion-button menuToggle>\n          <ion-icon name=\"menu\"></ion-icon>\n        </button>\n        <ion-title>\n          Second Page\n        </ion-title>\n      </ion-navbar>\n    </ion-header>\n\n    <ion-content>\n      <h1>Page 2</h1>\n    </ion-content>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], SegmentPage2);
    return SegmentPage2;
}());
exports.SegmentPage2 = SegmentPage2;
var E2EApp = (function () {
    function E2EApp() {
        this.root = SegmentPage;
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
                SegmentPage,
                SegmentPage2
            ],
            imports: [
                ionic_angular_1.IonicModule.forRoot(E2EApp)
            ],
            bootstrap: [ionic_angular_1.IonicApp],
            entryComponents: [
                E2EApp,
                SegmentPage,
                SegmentPage2
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;