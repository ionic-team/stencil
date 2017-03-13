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
var http_1 = require('@angular/http');
var ionic_angular_1 = require('../../../../../ionic-angular');
var E2EPage = (function () {
    function E2EPage(http) {
        this.http = http;
        this.images = [];
    }
    E2EPage.prototype.ngAfterViewInit = function () {
        var _this = this;
        var tags = 'madison wisconsin';
        var FLICKR_API_KEY = '504fd7414f6275eb5b657ddbfba80a2c';
        var baseUrl = 'https://api.flickr.com/services/rest/';
        this.http.get(baseUrl + '?method=flickr.groups.pools.getPhotos&group_id=1463451@N25&safe_search=1&api_key='
            + FLICKR_API_KEY + '&nojsoncallback=1&format=json&tags=' + tags)
            .subscribe(function (data) {
            _this.images = data.json().photos.photo.slice(0, 20);
            setTimeout(function () {
                _this.slider.update();
            });
        }, function (err) {
            console.info('Unable to load images');
            console.error(err);
        });
    };
    E2EPage.prototype.getImageUrl = function (item) {
        return "http://farm" + item.farm + ".static.flickr.com/" + item.server + "/" + item.id + "_" + item.secret + "_z.jpg";
    };
    __decorate([
        core_1.ViewChild(ionic_angular_1.Slides), 
        __metadata('design:type', (typeof (_a = typeof ionic_angular_1.Slides !== 'undefined' && ionic_angular_1.Slides) === 'function' && _a) || Object)
    ], E2EPage.prototype, "slider", void 0);
    E2EPage = __decorate([
        core_1.Component({
            templateUrl: 'main.html'
        }), 
        __metadata('design:paramtypes', [(typeof (_b = typeof http_1.Http !== 'undefined' && http_1.Http) === 'function' && _b) || Object])
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
                E2EApp,
                E2EPage
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;