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
    }
    Tab1 = __decorate([
        core_1.Component({
            template: "\n    <ion-header>\n      <ion-navbar>\n        <ion-title>Heart</ion-title>\n      </ion-navbar>\n    </ion-header>\n    <ion-content padding>\n      <h2>Tab 1</h2>\n    </ion-content>\n    "
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
    }
    Tab2 = __decorate([
        core_1.Component({
            template: "\n    <ion-header>\n      <ion-navbar>\n        <ion-title>Star</ion-title>\n      </ion-navbar>\n    </ion-header>\n    <ion-content padding>\n      <h2>Tab 2</h2>\n    </ion-content>\n    "
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
            template: "\n    <ion-header>\n      <ion-navbar>\n        <button ion-button menuToggle>\n          <ion-icon name=\"menu\"></ion-icon>\n        </button>\n        <ion-title>Stopwatch</ion-title>\n      </ion-navbar>\n    </ion-header>\n    <ion-content padding>\n      <h2>Tab 3</h2>\n    </ion-content>\n    "
        }), 
        __metadata('design:paramtypes', [])
    ], Tab3);
    return Tab3;
}());
exports.Tab3 = Tab3;
//
// Tab 3
//
var QuesaritoPage = (function () {
    function QuesaritoPage() {
    }
    QuesaritoPage = __decorate([
        core_1.Component({
            template: "\n    <ion-header>\n      <ion-navbar>\n        <button ion-button menuToggle>\n          <ion-icon name=\"menu\"></ion-icon>\n        </button>\n        <ion-title>Quesarito</ion-title>\n      </ion-navbar>\n    </ion-header>\n    <ion-content padding>\n      <h2>Quesarito</h2>\n    </ion-content>\n    "
        }), 
        __metadata('design:paramtypes', [])
    ], QuesaritoPage);
    return QuesaritoPage;
}());
exports.QuesaritoPage = QuesaritoPage;
var TabsPage = (function () {
    function TabsPage() {
        this.root1 = Tab1;
        this.root2 = Tab2;
        this.root3 = Tab3;
    }
    TabsPage.prototype.ngAfterViewInit = function () {
        console.log('Tab', this.tab);
        console.log(this.tab.first.setRoot);
    };
    TabsPage.prototype.openPage = function (which) {
        var pages = {
            'quesarito': QuesaritoPage
        };
        this.tab.first.setRoot(pages[which]);
    };
    __decorate([
        core_1.ViewChildren(ionic_angular_1.Tab), 
        __metadata('design:type', (typeof (_a = typeof core_1.QueryList !== 'undefined' && core_1.QueryList) === 'function' && _a) || Object)
    ], TabsPage.prototype, "tab", void 0);
    TabsPage = __decorate([
        core_1.Component({
            template: "\n    <ion-menu [content]=\"content\">\n      <ion-header>\n        <ion-toolbar color=\"secondary\">\n          <ion-title>Secret Menu</ion-title>\n        </ion-toolbar>\n      </ion-header>\n      <ion-content>\n        <ion-list>\n          <button ion-item menuClose detail-none (click)=\"openPage('quesarito')\">\n            Quesarito\n          </button>\n        </ion-list>\n      </ion-content>\n    </ion-menu>\n\n    <ion-tabs #content>\n      <ion-tab tabTitle=\"Heart\" tabIcon=\"heart\" [root]=\"root1\" #tab1></ion-tab>\n      <ion-tab tabTitle=\"Star\" tabIcon=\"star\" [root]=\"root2\"></ion-tab>\n      <ion-tab tabTitle=\"Stopwatch\" tabIcon=\"stopwatch\" [root]=\"root3\"></ion-tab>\n    </ion-tabs>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], TabsPage);
    return TabsPage;
    var _a;
}());
exports.TabsPage = TabsPage;
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                Tab1,
                Tab2,
                Tab3,
                QuesaritoPage,
                TabsPage
            ],
            imports: [
                ionic_angular_1.IonicModule.forRoot(TabsPage)
            ],
            bootstrap: [ionic_angular_1.IonicApp],
            entryComponents: [
                Tab1,
                Tab2,
                Tab3,
                QuesaritoPage,
                TabsPage
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;