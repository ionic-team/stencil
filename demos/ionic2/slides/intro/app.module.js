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
var IntroPage = (function () {
    function IntroPage(navCtrl) {
        this.navCtrl = navCtrl;
        this.continueText = 'Skip';
        this.showSlide = true;
    }
    IntroPage.prototype.ngOnInit = function () {
        this.slider.initialSlide = 1;
        this.slider.paginationClickable = true;
    };
    IntroPage.prototype.onSlideChanged = function (slider) {
        console.log('Slide changed', slider);
    };
    IntroPage.prototype.onSlideChangeStart = function (slider) {
        console.log('Slide change start', slider);
        slider.isEnd ? this.continueText = 'Continue' : this.continueText = 'Skip';
    };
    IntroPage.prototype.onSlideMove = function (slider) {
        console.log('Slide move', slider);
    };
    IntroPage.prototype.toggleLastSlide = function () {
        this.showSlide = !this.showSlide;
    };
    IntroPage.prototype.skip = function () {
        this.navCtrl.push(MainPage);
    };
    __decorate([
        core_1.ViewChild(ionic_angular_1.Slides), 
        __metadata('design:type', (typeof (_a = typeof ionic_angular_1.Slides !== 'undefined' && ionic_angular_1.Slides) === 'function' && _a) || Object)
    ], IntroPage.prototype, "slider", void 0);
    IntroPage = __decorate([
        core_1.Component({
            templateUrl: 'main.html'
        }), 
        __metadata('design:paramtypes', [(typeof (_b = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _b) || Object])
    ], IntroPage);
    return IntroPage;
    var _a, _b;
}());
exports.IntroPage = IntroPage;
var MainPage = (function () {
    function MainPage() {
    }
    MainPage = __decorate([
        core_1.Component({
            template: "\n  <ion-header>\n    <ion-navbar>\n      <ion-title>Slides</ion-title>\n    </ion-navbar>\n  </ion-header>\n\n  <ion-content padding>\n    <h1>Another Page</h1>\n  </ion-content>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], MainPage);
    return MainPage;
}());
exports.MainPage = MainPage;
var E2EApp = (function () {
    function E2EApp() {
        this.root = IntroPage;
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
                IntroPage,
                MainPage
            ],
            imports: [
                ionic_angular_1.IonicModule.forRoot(E2EApp)
            ],
            bootstrap: [ionic_angular_1.IonicApp],
            entryComponents: [
                E2EApp,
                IntroPage,
                MainPage
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;