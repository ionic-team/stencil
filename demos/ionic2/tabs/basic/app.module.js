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
// Modal
//
var MyModal = (function () {
    function MyModal(viewCtrl, app) {
        this.viewCtrl = viewCtrl;
        this.app = app;
        this.items = [];
        for (var i = 1; i <= 10; i++) {
            this.items.push(i);
        }
    }
    MyModal.prototype.dismiss = function () {
        // using the injected ViewController this page
        // can "dismiss" itself and pass back data
        this.viewCtrl.dismiss();
    };
    MyModal.prototype.appNavPop = function () {
        this.app.navPop();
    };
    MyModal = __decorate([
        core_1.Component({
            template: "\n  <ion-header>\n    <ion-toolbar>\n      <ion-buttons start>\n        <button ion-button (click)=\"dismiss()\">Cancel</button>\n      </ion-buttons>\n\n      <ion-title>\n        Filter Sessions\n      </ion-title>\n\n      <ion-buttons end>\n        <button ion-button (click)=\"dismiss()\">Done</button>\n      </ion-buttons>\n    </ion-toolbar>\n  </ion-header>\n\n  <ion-content class=\"outer-content\">\n    <ion-list>\n      <ion-list-header>Tracks</ion-list-header>\n\n      <ion-item *ngFor=\"let i of items\">\n        <ion-label>Toggle {{i}}</ion-label>\n        <ion-toggle color=\"secondary\"></ion-toggle>\n      </ion-item>\n    </ion-list>\n\n    <ion-list>\n      <button ion-item color=\"danger\" detail-none>\n        Reset All Filters\n      </button>\n      <button ion-item color=\"danger\" detail-none (click)=\"appNavPop()\">\n        App Nav Pop\n      </button>\n    </ion-list>\n  </ion-content>\n  "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.ViewController !== 'undefined' && ionic_angular_1.ViewController) === 'function' && _a) || Object, (typeof (_b = typeof ionic_angular_1.App !== 'undefined' && ionic_angular_1.App) === 'function' && _b) || Object])
    ], MyModal);
    return MyModal;
    var _a, _b;
}());
exports.MyModal = MyModal;
//
// Tab 1
//
var Tab1 = (function () {
    function Tab1(tabs, app) {
        this.tabs = tabs;
        this.app = app;
        this.items = [];
        for (var i = 1; i <= 250; i++) {
            this.items.push(i);
        }
    }
    Tab1.prototype.selectPrevious = function () {
        this.tabs.select(this.tabs.previousTab());
    };
    Tab1.prototype.appNavPop = function () {
        this.app.navPop();
    };
    Tab1 = __decorate([
        core_1.Component({
            template: "\n    <ion-header>\n      <ion-navbar>\n        <ion-title>Settings</ion-title>\n      </ion-navbar>\n    </ion-header>\n\n    <ion-content>\n      <ion-list>\n        <ion-list-header>\n          Tab 1\n        </ion-list-header>\n        <ion-item *ngFor=\"let i of items\">Item {{i}} {{i}} {{i}} {{i}}</ion-item>\n      </ion-list>\n      <p>\n        <button ion-button (click)=\"selectPrevious()\">Select Previous Tab</button>\n      </p>\n      <p>\n        <button ion-button (click)=\"appNavPop()\">App Nav Pop</button>\n      </p>\n    </ion-content>\n    "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.Tabs !== 'undefined' && ionic_angular_1.Tabs) === 'function' && _a) || Object, (typeof (_b = typeof ionic_angular_1.App !== 'undefined' && ionic_angular_1.App) === 'function' && _b) || Object])
    ], Tab1);
    return Tab1;
    var _a, _b;
}());
exports.Tab1 = Tab1;
//
// Tab 2
//
var Tab2 = (function () {
    function Tab2(tabs, app) {
        this.tabs = tabs;
        this.app = app;
        this.sessions = [];
        for (var i = 1; i <= 250; i++) {
            this.sessions.push({
                name: 'Name ' + i,
                location: 'Location: ' + i
            });
        }
    }
    Tab2.prototype.selectPrevious = function () {
        this.tabs.select(this.tabs.previousTab());
    };
    Tab2.prototype.appNavPop = function () {
        this.app.navPop();
    };
    Tab2 = __decorate([
        core_1.Component({
            template: "\n    <ion-header>\n      <ion-navbar>\n        <ion-title>Schedule</ion-title>\n      </ion-navbar>\n    </ion-header>\n\n    <ion-content>\n      <ion-list>\n        <ion-item-sliding *ngFor=\"let session of sessions\" #slidingItem>\n          <ion-item>\n            <h3>{{session.name}} {{session.name}} {{session.name}}</h3>\n            <p>{{session.location}} {{session.location}} {{session.location}}</p>\n          </ion-item>\n          <ion-item-options>\n            <button ion-button color=\"primary\">Speaker<br>Info</button>\n            <button ion-button color=\"secondary\">Add to<br>Favorites</button>\n          </ion-item-options>\n        </ion-item-sliding>\n      </ion-list>\n      <p>\n        <button ion-button (click)=\"selectPrevious()\">Select Previous Tab</button>\n      </p>\n      <p>\n        <button ion-button (click)=\"appNavPop()\">App Nav Pop</button>\n      </p>\n    </ion-content>\n  "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.Tabs !== 'undefined' && ionic_angular_1.Tabs) === 'function' && _a) || Object, (typeof (_b = typeof ionic_angular_1.App !== 'undefined' && ionic_angular_1.App) === 'function' && _b) || Object])
    ], Tab2);
    return Tab2;
    var _a, _b;
}());
exports.Tab2 = Tab2;
//
// Tab 3
//
var Tab3 = (function () {
    function Tab3(alertCtrl, modalCtrl, tabs, app) {
        this.alertCtrl = alertCtrl;
        this.modalCtrl = modalCtrl;
        this.tabs = tabs;
        this.app = app;
        this.items = [];
        for (var i = 0; i < 100; i++) {
            this.items.push(i);
        }
    }
    Tab3.prototype.presentAlert = function () {
        var alert = this.alertCtrl.create({
            title: 'Alert Title!',
            buttons: ['Dismiss']
        });
        alert.present();
    };
    Tab3.prototype.presentModal = function () {
        this.modalCtrl.create(MyModal).present();
    };
    Tab3.prototype.selectPrevious = function () {
        this.tabs.select(this.tabs.previousTab());
    };
    Tab3.prototype.appNavPop = function () {
        this.app.navPop();
    };
    Tab3 = __decorate([
        core_1.Component({
            template: "\n    <ion-header>\n      <ion-navbar>\n        <button ion-button menuToggle>\n          <ion-icon name=\"menu\"></ion-icon>\n        </button>\n        <ion-title>Stopwatch</ion-title>\n      </ion-navbar>\n    </ion-header>\n\n    <ion-content padding>\n      <h2>Tab 3</h2>\n      <p>\n        <button ion-button (click)=\"presentAlert()\">Present Alert</button>\n        <button ion-button (click)=\"presentModal()\">Present Modal</button>\n      </p>\n      <p>\n        <button ion-button (click)=\"selectPrevious()\">Select Previous Tab</button>\n        <button ion-button (click)=\"appNavPop()\">App Nav Pop</button>\n      </p>\n\n      <ion-list [virtualScroll]=\"items\">\n\n        <ion-item *virtualItem=\"let item\">\n          Item: {{item}}\n        </ion-item>\n\n      </ion-list>\n\n    </ion-content>\n    "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.AlertController !== 'undefined' && ionic_angular_1.AlertController) === 'function' && _a) || Object, (typeof (_b = typeof ionic_angular_1.ModalController !== 'undefined' && ionic_angular_1.ModalController) === 'function' && _b) || Object, (typeof (_c = typeof ionic_angular_1.Tabs !== 'undefined' && ionic_angular_1.Tabs) === 'function' && _c) || Object, (typeof (_d = typeof ionic_angular_1.App !== 'undefined' && ionic_angular_1.App) === 'function' && _d) || Object])
    ], Tab3);
    return Tab3;
    var _a, _b, _c, _d;
}());
exports.Tab3 = Tab3;
var TabsPage = (function () {
    function TabsPage(config) {
        this.root1 = Tab1;
        this.root2 = Tab2;
        this.root3 = Tab3;
        this.myColor = (config.get('mode') !== 'ios') ? 'primary' : null;
    }
    TabsPage.prototype.onChange = function (ev) {
        console.log('Changed tab', ev);
    };
    TabsPage.prototype.onSelect = function (ev) {
        console.log('Selected tab', ev);
    };
    TabsPage = __decorate([
        core_1.Component({
            template: "\n    <ion-menu [content]=\"content\">\n      <ion-header>\n        <ion-toolbar color=\"secondary\">\n          <ion-title>Menu</ion-title>\n        </ion-toolbar>\n      </ion-header>\n      <ion-content>\n        <ion-list>\n          <button ion-item menuClose detail-none>\n            Close Menu\n          </button>\n        </ion-list>\n      </ion-content>\n    </ion-menu>\n\n    <ion-tabs #content (ionChange)=\"onChange($event)\" [color]=\"myColor\">\n      <ion-tab tabTitle=\"Plain List\" tabIcon=\"star\" [root]=\"root1\" (ionSelect)=\"onSelect($event)\"></ion-tab>\n      <ion-tab tabTitle=\"Schedule\" tabIcon=\"globe\" [root]=\"root2\"></ion-tab>\n      <ion-tab tabTitle=\"Stopwatch\" tabIcon=\"logo-facebook\" [root]=\"root3\"></ion-tab>\n      <ion-tab tabTitle=\"Messages\" tabIcon=\"md-chatboxes\" [root]=\"root1\"></ion-tab>\n      <ion-tab tabTitle=\"My Profile\" tabIcon=\"ios-person\" [root]=\"root2\"></ion-tab>\n    </ion-tabs>\n  "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.Config !== 'undefined' && ionic_angular_1.Config) === 'function' && _a) || Object])
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
                MyModal,
                Tab1,
                Tab2,
                Tab3,
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
                MyModal,
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