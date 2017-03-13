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
var E2EPage1 = (function () {
    function E2EPage1(navCtrl) {
        this.navCtrl = navCtrl;
        this.items = [];
        this.enabled = true;
        for (var i = 0; i < 30; i++) {
            this.items.push(this.items.length);
        }
    }
    E2EPage1.prototype.doInfinite = function () {
        var _this = this;
        console.log('Begin async operation');
        return getAsyncData().then(function (newData) {
            for (var i = 0; i < newData.length; i++) {
                _this.items.push(_this.items.length);
            }
            console.log('Finished receiving data, async operation complete');
            if (_this.items.length > 90) {
                _this.enabled = false;
            }
        });
    };
    E2EPage1.prototype.goToPage2 = function () {
        this.navCtrl.push(E2EPage2);
    };
    E2EPage1.prototype.toggleInfiniteScroll = function () {
        this.enabled = !this.enabled;
    };
    __decorate([
        core_1.ViewChild(ionic_angular_1.InfiniteScroll), 
        __metadata('design:type', (typeof (_a = typeof ionic_angular_1.InfiniteScroll !== 'undefined' && ionic_angular_1.InfiniteScroll) === 'function' && _a) || Object)
    ], E2EPage1.prototype, "infiniteScroll", void 0);
    E2EPage1 = __decorate([
        core_1.Component({
            templateUrl: 'main.html'
        }), 
        __metadata('design:paramtypes', [(typeof (_b = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _b) || Object])
    ], E2EPage1);
    return E2EPage1;
    var _a, _b;
}());
exports.E2EPage1 = E2EPage1;
var E2EPage2 = (function () {
    function E2EPage2(navCtrl) {
        this.navCtrl = navCtrl;
    }
    E2EPage2 = __decorate([
        core_1.Component({
            template: '<ion-content><button ion-button (click)="navCtrl.pop()">Pop</button></ion-content>'
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _a) || Object])
    ], E2EPage2);
    return E2EPage2;
    var _a;
}());
exports.E2EPage2 = E2EPage2;
var E2EApp = (function () {
    function E2EApp() {
        this.root = E2EPage1;
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
                E2EPage1,
                E2EPage2
            ],
            imports: [
                ionic_angular_1.IonicModule.forRoot(E2EApp)
            ],
            bootstrap: [ionic_angular_1.IonicApp],
            entryComponents: [
                E2EApp,
                E2EPage1,
                E2EPage2
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
function getAsyncData() {
    // async return mock data
    return new Promise(function (resolve) {
        setTimeout(function () {
            var data = [];
            for (var i = 0; i < 30; i++) {
                data.push(i);
            }
            resolve(data);
        }, 500);
    });
}