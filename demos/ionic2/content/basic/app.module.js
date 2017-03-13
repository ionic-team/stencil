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
var TabsPage = (function () {
    function TabsPage() {
        this.main = E2EPage;
        this.page1 = Page1;
        this.page2 = Page2;
        this.page3 = Page3;
        this.page4 = Page4;
    }
    TabsPage = __decorate([
        core_1.Component({
            templateUrl: 'tabs.html'
        }), 
        __metadata('design:paramtypes', [])
    ], TabsPage);
    return TabsPage;
}());
exports.TabsPage = TabsPage;
var Page4 = (function () {
    function Page4() {
        this.tabsPage = TabsPage;
    }
    Page4 = __decorate([
        core_1.Component({
            templateUrl: 'page4.html'
        }), 
        __metadata('design:paramtypes', [])
    ], Page4);
    return Page4;
}());
exports.Page4 = Page4;
var Page3 = (function () {
    function Page3() {
        this.page4 = Page4;
    }
    Page3 = __decorate([
        core_1.Component({
            templateUrl: 'page3.html'
        }), 
        __metadata('design:paramtypes', [])
    ], Page3);
    return Page3;
}());
exports.Page3 = Page3;
var Page2 = (function () {
    function Page2() {
        this.page3 = Page3;
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
var Page1 = (function () {
    function Page1() {
        this.page2 = Page2;
    }
    Page1 = __decorate([
        core_1.Component({
            templateUrl: 'page1.html'
        }), 
        __metadata('design:paramtypes', [])
    ], Page1);
    return Page1;
}());
exports.Page1 = Page1;
var E2EPage = (function () {
    function E2EPage() {
        this.page1 = Page1;
        this.showToolbar = false;
    }
    E2EPage.prototype.onScroll = function (ev) {
        console.log("scroll move: scrollTop: " + ev.scrollTop + ", directionY: " + ev.directionY + ", velocityY: " + ev.velocityY);
    };
    E2EPage.prototype.toggleToolbar = function () {
        this.showToolbar = !this.showToolbar;
        this.content.resize();
    };
    __decorate([
        core_1.ViewChild(ionic_angular_1.Content), 
        __metadata('design:type', (typeof (_a = typeof ionic_angular_1.Content !== 'undefined' && ionic_angular_1.Content) === 'function' && _a) || Object)
    ], E2EPage.prototype, "content", void 0);
    E2EPage = __decorate([
        core_1.Component({
            templateUrl: 'main.html'
        }), 
        __metadata('design:paramtypes', [])
    ], E2EPage);
    return E2EPage;
    var _a;
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
                TabsPage,
                Page1,
                Page2,
                Page3,
                Page4
            ],
            imports: [
                ionic_angular_1.IonicModule.forRoot(E2EApp)
            ],
            bootstrap: [ionic_angular_1.IonicApp],
            entryComponents: [
                E2EApp,
                E2EPage,
                TabsPage,
                Page1,
                Page2,
                Page3,
                Page4
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;