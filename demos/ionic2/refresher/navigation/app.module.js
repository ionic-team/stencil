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
var Page1 = (function () {
    function Page1(nav) {
        this.nav = nav;
        this.items = [];
        for (var i = 0; i < 15; i++) {
            this.items.push(getRandomData());
        }
    }
    Page1.prototype.doRefresh = function (refresher) {
        var _this = this;
        console.info('Begin async operation');
        getAsyncData().then(function (newData) {
            for (var i = 0; i < newData.length; i++) {
                _this.items.unshift(newData[i]);
            }
            console.info('Finished receiving data, async operation complete');
            refresher.complete();
        });
    };
    Page1.prototype.doStart = function (refresher) {
        console.info('Refresher, start');
    };
    Page1.prototype.doPulling = function (refresher) {
        console.info('Pulling', refresher.progress);
    };
    Page1.prototype.navigate = function () {
        this.nav.setRoot(Page2);
    };
    Page1 = __decorate([
        core_1.Component({
            templateUrl: 'main.html'
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _a) || Object])
    ], Page1);
    return Page1;
    var _a;
}());
exports.Page1 = Page1;
function getAsyncData() {
    // async return mock data
    return new Promise(function (resolve) {
        setTimeout(function () {
            var data = [];
            for (var i = 0; i < 3; i++) {
                data.push(getRandomData());
            }
            resolve(data);
        }, 3000);
    });
}
function getRandomData() {
    var i = Math.floor(Math.random() * data.length);
    return data[i];
}
var data = [
    'Fast Times at Ridgemont High',
    'Peggy Sue Got Married',
    'Raising Arizona',
    'Moonstruck',
    'Fire Birds',
    'Honeymoon in Vegas',
    'Amos & Andrew',
    'It Could Happen to You',
    'Trapped in Paradise',
    'Leaving Las Vegas',
    'The Rock',
    'Con Air',
    'Face/Off',
    'City of Angels',
    'Gone in Sixty Seconds',
    'The Family Man',
    'Windtalkers',
    'Matchstick Men',
    'National Treasure',
    'Ghost Rider',
    'Grindhouse',
    'Next',
    'Kick-Ass',
    'Drive Angry'
];
var Page2 = (function () {
    function Page2() {
    }
    Page2 = __decorate([
        core_1.Component({
            templateUrl: 'page2.html'
        }), 
        __metadata('design:paramtypes', [])
    ], Page2);
    return Page2;
}());
exports.Page2 = Page2;
var E2EApp = (function () {
    function E2EApp() {
        this.rootPage = Page1;
    }
    E2EApp = __decorate([
        core_1.Component({
            template: '<ion-nav [root]="rootPage"></ion-nav>'
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
                Page1,
                Page2
            ],
            imports: [
                ionic_angular_1.IonicModule.forRoot(E2EApp)
            ],
            bootstrap: [ionic_angular_1.IonicApp],
            entryComponents: [
                E2EApp,
                Page1,
                Page2
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;