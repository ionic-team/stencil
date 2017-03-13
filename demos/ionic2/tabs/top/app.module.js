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
    function Tab1() {
        this.items = [];
        for (var i = 1; i <= 250; i++) {
            this.items.push(i);
        }
    }
    Tab1 = __decorate([
        core_1.Component({
            template: "\n    <ion-header>\n      <ion-navbar>\n        <ion-title>Speakers</ion-title>\n      </ion-navbar>\n    </ion-header>\n\n    <ion-content>\n      <ion-list>\n        <ion-list-header>\n          Tab 1\n        </ion-list-header>\n        <ion-item *ngFor=\"let i of items\">Item {{i}} {{i}} {{i}} {{i}}</ion-item>\n      </ion-list>\n    </ion-content>\n    "
        }), 
        __metadata('design:paramtypes', [])
    ], Tab1);
    return Tab1;
}());
exports.Tab1 = Tab1;
//
// Tab 2
//
var Tab2 = (function () {
    function Tab2() {
        this.sessions = [];
        for (var i = 1; i <= 250; i++) {
            this.sessions.push({
                name: 'Name ' + i,
                location: 'Location: ' + i
            });
        }
    }
    Tab2 = __decorate([
        core_1.Component({
            template: "\n    <ion-header>\n      <ion-navbar>\n        <ion-title>Schedule</ion-title>\n      </ion-navbar>\n      <ion-toolbar>\n        <ion-searchbar></ion-searchbar>\n      </ion-toolbar>\n    </ion-header>\n\n    <ion-content>\n      <ion-list>\n        <ion-item-sliding *ngFor=\"let session of sessions\" #slidingItem>\n          <ion-item>\n            <h3>{{session.name}} {{session.name}} {{session.name}}</h3>\n            <p>{{session.location}} {{session.location}} {{session.location}}</p>\n          </ion-item>\n          <ion-item-options>\n            <button ion-button color=\"primary\">Speaker<br>Info</button>\n            <button ion-button color=\"secondary\">Add to<br>Favorites</button>\n          </ion-item-options>\n        </ion-item-sliding>\n      </ion-list>\n    </ion-content>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], Tab2);
    return Tab2;
}());
exports.Tab2 = Tab2;
//
// Tab 3
//
var Tab3 = (function () {
    function Tab3() {
    }
    Tab3 = __decorate([
        core_1.Component({
            template: "\n    <ion-header>\n      <ion-navbar>\n        <ion-title>Map</ion-title>\n      </ion-navbar>\n    </ion-header>\n\n    <ion-content padding>\n      <h2>Tab 3</h2>\n    </ion-content>\n    "
        }), 
        __metadata('design:paramtypes', [])
    ], Tab3);
    return Tab3;
}());
exports.Tab3 = Tab3;
var TabsPage = (function () {
    function TabsPage() {
        this.root1 = Tab1;
        this.root2 = Tab2;
        this.root3 = Tab3;
    }
    TabsPage = __decorate([
        core_1.Component({
            template: "\n    <ion-tabs>\n      <ion-tab tabTitle=\"Speakers\" tabIcon=\"person\" [root]=\"root1\"></ion-tab>\n      <ion-tab tabTitle=\"Schedule\" tabIcon=\"globe\" [root]=\"root2\"></ion-tab>\n      <ion-tab tabTitle=\"Map\" tabIcon=\"map\" [root]=\"root3\"></ion-tab>\n    </ion-tabs>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], TabsPage);
    return TabsPage;
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
                Tab3,
                TabsPage
            ],
            imports: [
                ionic_angular_1.IonicModule.forRoot(E2EApp, {
                    tabsPlacement: 'top'
                })
            ],
            bootstrap: [ionic_angular_1.IonicApp],
            entryComponents: [
                E2EApp,
                Tab1,
                Tab2,
                Tab3,
                TabsPage
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;