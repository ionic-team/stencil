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
var E2EApp = (function () {
    function E2EApp() {
        this.root = LandingPage;
    }
    E2EApp = __decorate([
        core_1.Component({
            template: "<ion-nav [root]=\"root\"></ion-nav>",
        }), 
        __metadata('design:paramtypes', [])
    ], E2EApp);
    return E2EApp;
}());
exports.E2EApp = E2EApp;
var LandingPage = (function () {
    function LandingPage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    LandingPage.prototype.goToPage = function () {
        this.navCtrl.push(FirstPage);
    };
    LandingPage = __decorate([
        core_1.Component({
            template: "\n  <ion-header>\n    <ion-navbar>\n      <ion-title>\n        Landing Page Comp\n      </ion-title>\n    </ion-navbar>\n  </ion-header>\n\n  <ion-content>\n    <button ion-button color=\"primary\" (click)=\"goToPage()\" class=\"e2eChildNavsNested\">\n      Nested Children Test\n    </button>\n  </ion-content>\n  "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _a) || Object])
    ], LandingPage);
    return LandingPage;
    var _a;
}());
exports.LandingPage = LandingPage;
var FirstPage = (function () {
    function FirstPage() {
        this.root = SecondPage;
    }
    FirstPage = __decorate([
        core_1.Component({
            template: "\n  <ion-header>\n    <ion-navbar>\n      <ion-title>\n        First Page Comp\n      </ion-title>\n    </ion-navbar>\n  </ion-header>\n\n  <ion-content>\n    <h3>Sub Header First Page</h3>\n    <ion-nav [root]=\"root\"></ion-nav>\n  </ion-content>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], FirstPage);
    return FirstPage;
}());
exports.FirstPage = FirstPage;
var SecondPage = (function () {
    function SecondPage() {
        this.root = ThirdPage;
    }
    SecondPage = __decorate([
        core_1.Component({
            template: "\n  <ion-header>\n    <ion-navbar>\n      <ion-title>\n        Second Page Comp\n      </ion-title>\n    </ion-navbar>\n  </ion-header>\n\n  <ion-content>\n    <h3>Sub Header Second Page</h3>\n    <ion-nav [root]=\"root\"></ion-nav>\n  </ion-content>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], SecondPage);
    return SecondPage;
}());
exports.SecondPage = SecondPage;
var ThirdPage = (function () {
    function ThirdPage() {
        this.root = FourthPage;
    }
    ThirdPage = __decorate([
        core_1.Component({
            template: "\n  <ion-header>\n    <ion-navbar>\n      <ion-title>\n        Third Page Comp\n      </ion-title>\n    </ion-navbar>\n  </ion-header>\n\n  <ion-content>\n    <h3>Sub Header Third Page</h3>\n    <ion-nav [root]=\"root\"></ion-nav>\n  </ion-content>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], ThirdPage);
    return ThirdPage;
}());
exports.ThirdPage = ThirdPage;
var FourthPage = (function () {
    function FourthPage() {
    }
    FourthPage.prototype.ionViewWillEnter = function () {
        var items = [];
        for (var i = 0; i < 500; i++) {
            items.push("Item " + (i + 1));
        }
        this.items = items;
    };
    FourthPage = __decorate([
        core_1.Component({
            template: "\n  <ion-content>\n    <ion-list>\n      <ion-item *ngFor=\"let item of items\">\n        {{item}}\n      </ion-item>\n    </ion-list>\n  </ion-content>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], FourthPage);
    return FourthPage;
}());
exports.FourthPage = FourthPage;
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                E2EApp,
                LandingPage,
                FirstPage,
                SecondPage,
                ThirdPage,
                FourthPage
            ],
            imports: [
                ionic_angular_1.IonicModule.forRoot(E2EApp)
            ],
            bootstrap: [ionic_angular_1.IonicApp],
            entryComponents: [
                E2EApp,
                LandingPage,
                FirstPage,
                SecondPage,
                ThirdPage,
                FourthPage
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;