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
var MyPage = (function () {
    function MyPage() {
    }
    MyPage.prototype.onSlideChanged = function () {
        var previousIndex = this.slider.getPreviousIndex();
        var currentIndex = this.slider.getActiveIndex();
        console.log('Previous index is', previousIndex, 'Current index is', currentIndex);
    };
    MyPage.prototype.onSlideMove = function (ev) {
        console.log('Slide moving', ev);
    };
    MyPage.prototype.goToPrevSlide = function () {
        this.slider.slidePrev();
    };
    MyPage.prototype.goToNextSlide = function () {
        this.slider.slideNext();
    };
    MyPage.prototype.goToSlide = function (index) {
        this.slider.slideTo(index);
    };
    MyPage.prototype.getIndex = function () {
        var index = this.slider.getActiveIndex();
        console.log('Current Index is', index);
    };
    MyPage.prototype.getLength = function () {
        var length = this.slider.length();
        console.log('Current Length is', length);
    };
    __decorate([
        core_1.ViewChild('mySlider'), 
        __metadata('design:type', (typeof (_a = typeof ionic_angular_1.Slides !== 'undefined' && ionic_angular_1.Slides) === 'function' && _a) || Object)
    ], MyPage.prototype, "slider", void 0);
    MyPage = __decorate([
        core_1.Component({
            templateUrl: 'main.html'
        }), 
        __metadata('design:paramtypes', [])
    ], MyPage);
    return MyPage;
    var _a;
}());
exports.MyPage = MyPage;
var E2EApp = (function () {
    function E2EApp() {
        this.root = MyPage;
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
                MyPage
            ],
            imports: [
                ionic_angular_1.IonicModule.forRoot(E2EApp)
            ],
            bootstrap: [ionic_angular_1.IonicApp],
            entryComponents: [
                E2EApp,
                MyPage
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;