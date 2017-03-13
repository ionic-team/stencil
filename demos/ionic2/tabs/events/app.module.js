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
//
// Tab 1
//
var Tab1 = (function () {
    function Tab1(events) {
        this.events = events;
        this.datatest = 'old';
        this.called = 0;
        this.events.subscribe('data:changed', this.change.bind(this));
    }
    Tab1.prototype.change = function () {
        console.log(this.datatest);
        console.log('data changed!');
        this.called++;
        this.datatest = 'new!';
    };
    Tab1 = __decorate([
        core_1.Component({
            template: "\n    <ion-header>\n      <ion-navbar>\n        <ion-title>Home</ion-title>\n      </ion-navbar>\n    </ion-header>\n\n    <ion-content padding>\n      <p>Tap the third tab below to fire broken events</p>\n      <p>Then change to Tab 2 and back to Home</p>\n      <p>{{datatest}} called: {{called}}</p>\n      <button ion-button (click)=\"change()\">Fire events correctly</button>\n    </ion-content>\n    "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.Events !== 'undefined' && ionic_angular_1.Events) === 'function' && _a) || Object])
    ], Tab1);
    return Tab1;
    var _a;
}());
exports.Tab1 = Tab1;
//
// Tab 2
//
var Tab2 = (function () {
    function Tab2() {
    }
    Tab2 = __decorate([
        core_1.Component({
            template: "\n    <ion-header>\n      <ion-navbar>\n        <ion-title>Tab 2</ion-title>\n      </ion-navbar>\n    </ion-header>\n\n    <ion-content>\n    Change back to home\n    </ion-content>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], Tab2);
    return Tab2;
}());
exports.Tab2 = Tab2;
var TabsPage = (function () {
    function TabsPage(events) {
        this.events = events;
        this.root1 = Tab1;
        this.root2 = Tab2;
    }
    TabsPage.prototype.takePhoto = function () {
        this.events.publish('data:changed');
    };
    TabsPage = __decorate([
        core_1.Component({
            template: "\n    <ion-tabs>\n      <ion-tab tabTitle=\"Home\" tabIcon=\"star\" [root]=\"root1\" ></ion-tab>\n      <ion-tab tabTitle=\"Tab 2\" tabIcon=\"globe\" [root]=\"root2\"></ion-tab>\n      <ion-tab tabTitle=\"Break events\" tabIcon=\"camera\" (ionSelect)=\"takePhoto()\"></ion-tab>\n    </ion-tabs>\n  "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.Events !== 'undefined' && ionic_angular_1.Events) === 'function' && _a) || Object])
    ], TabsPage);
    return TabsPage;
    var _a;
}());
exports.TabsPage = TabsPage;
var E2EApp = (function () {
    function E2EApp() {
        this.root = TabsPage;
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
                Tab1,
                Tab2,
                TabsPage
            ],
            imports: [
                ionic_angular_1.IonicModule.forRoot(E2EApp, {
                    tabsHighlight: true,
                })
            ],
            bootstrap: [ionic_angular_1.IonicApp],
            entryComponents: [
                E2EApp,
                Tab1,
                Tab2,
                TabsPage
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;