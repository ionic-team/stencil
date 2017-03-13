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
    function E2EPage(config, plt) {
        this.plt = plt;
        this.duration = '1000';
        this.easing = 'ease-in-out';
    }
    E2EPage.prototype.playGreen = function () {
        var a = new ionic_angular_1.Animation(this.plt, '.green');
        a.fromTo('translateX', '0px', '200px');
        a.duration(parseInt(this.duration, 10));
        a.easing(this.easing);
        a.play();
    };
    E2EPage.prototype.memoryCheck = function () {
        var self = this;
        var count = 0;
        function play() {
            count++;
            if (count >= 100) {
                console.log('Play done');
                return;
            }
            console.log('Play', count);
            var a = new ionic_angular_1.Animation(self.plt, '.green');
            a.fromTo('translateX', '0px', '200px');
            a.duration(parseInt(self.duration, 10));
            a.easing(self.easing);
            a.onFinish(function (animation) {
                setTimeout(function () {
                    play();
                }, 100);
                animation.destroy();
            });
            a.play();
        }
        play();
    };
    E2EPage = __decorate([
        core_1.Component({
            templateUrl: 'main.html'
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.Config !== 'undefined' && ionic_angular_1.Config) === 'function' && _a) || Object, (typeof (_b = typeof ionic_angular_1.Platform !== 'undefined' && ionic_angular_1.Platform) === 'function' && _b) || Object])
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
                E2EPage
            ],
            imports: [
                ionic_angular_1.IonicModule.forRoot(E2EApp)
            ],
            bootstrap: [ionic_angular_1.IonicApp],
            entryComponents: [
                E2EPage
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;