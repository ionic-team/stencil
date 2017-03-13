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
var core_2 = require('@angular/core');
var SomeData = (function () {
    function SomeData() {
    }
    SomeData.prototype.getData = function () {
        return 'SomeData';
    };
    SomeData = __decorate([
        core_2.Injectable(), 
        __metadata('design:paramtypes', [])
    ], SomeData);
    return SomeData;
}());
exports.SomeData = SomeData;
var OtherData = (function () {
    function OtherData() {
    }
    OtherData.prototype.getData = function () {
        return 'OtherData';
    };
    OtherData = __decorate([
        core_2.Injectable(), 
        __metadata('design:paramtypes', [])
    ], OtherData);
    return OtherData;
}());
exports.OtherData = OtherData;
var MyModal = (function () {
    function MyModal(viewCtrl) {
        this.viewCtrl = viewCtrl;
    }
    MyModal.prototype.dismissModal = function () {
        this.viewCtrl.dismiss();
    };
    MyModal = __decorate([
        core_1.Component({
            template: "\n  <ion-header>\n    <ion-toolbar>\n      <ion-title>This is a modal</ion-title>\n      <ion-buttons left>\n        <button ion-button icon-only (click)=\"dismissModal()\" class=\"e2eCordovaCloseModal\">\n          <ion-icon name=\"close\"></ion-icon>\n        </button>\n      </ion-buttons>\n      <ion-buttons end>\n        <button ion-button icon-only>\n          <ion-icon name=\"funnel\"></ion-icon>\n        </button>\n      </ion-buttons>\n    </ion-toolbar>\n  </ion-header>\n  <ion-content padding>\n    <p>The modal toolbar should have status bar padding.</p>\n    <button ion-button block (click)=\"dismissModal()\">Close modal</button>\n  </ion-content>\n  "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.ViewController !== 'undefined' && ionic_angular_1.ViewController) === 'function' && _a) || Object])
    ], MyModal);
    return MyModal;
    var _a;
}());
exports.MyModal = MyModal;
var Page1 = (function () {
    function Page1(navCtrl, someData, otherData) {
        this.navCtrl = navCtrl;
        this.someData = someData;
        this.otherData = otherData;
        this.page2 = Page2;
        this.sort = 'all';
        console.log('Got some data from', someData.getData());
        console.log('Got some data from', otherData.getData());
    }
    Page1.prototype.goToTabs = function () {
        this.navCtrl.push(TabsPage);
    };
    Page1 = __decorate([
        core_1.Component({
            templateUrl: 'page1.html'
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _a) || Object, SomeData, OtherData])
    ], Page1);
    return Page1;
    var _a;
}());
exports.Page1 = Page1;
var Page2 = (function () {
    function Page2(modalCtrl) {
        this.modalCtrl = modalCtrl;
        this.page1 = Page1;
        this.page3 = Page3;
    }
    Page2.prototype.openModal = function () {
        this.modalCtrl.create(MyModal).present();
    };
    Page2 = __decorate([
        core_1.Component({
            templateUrl: 'page2.html'
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.ModalController !== 'undefined' && ionic_angular_1.ModalController) === 'function' && _a) || Object])
    ], Page2);
    return Page2;
    var _a;
}());
exports.Page2 = Page2;
var Page3 = (function () {
    function Page3(navCtrl) {
        this.navCtrl = navCtrl;
    }
    Page3.prototype.goBack = function () {
        this.navCtrl.pop();
    };
    Page3 = __decorate([
        core_1.Component({
            templateUrl: 'page3.html'
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _a) || Object])
    ], Page3);
    return Page3;
    var _a;
}());
exports.Page3 = Page3;
var TabPage1 = (function () {
    function TabPage1() {
    }
    TabPage1 = __decorate([
        core_1.Component({
            template: "\n  <ion-header>\n    <ion-navbar>\n      <ion-title>This is a tab page</ion-title>\n      <button ion-button menuToggle>\n        <ion-icon name=\"menu\"></ion-icon>\n      </button>\n      <ion-buttons end>\n        <button ion-button>\n          <ion-icon name=\"funnel\"></ion-icon>\n        </button>\n      </ion-buttons>\n    </ion-navbar>\n  </ion-header>\n  <ion-content padding>\n    <p>The toolbar should have status bar padding.</p>\n  </ion-content>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], TabPage1);
    return TabPage1;
}());
exports.TabPage1 = TabPage1;
var TabsPage = (function () {
    function TabsPage(navCtrl) {
        this.navCtrl = navCtrl;
        this.tab1Root = TabPage1;
        this.tab2Root = Page2;
        this.tab3Root = Page3;
    }
    TabsPage.prototype.goBack = function () {
        this.navCtrl.pop();
    };
    TabsPage = __decorate([
        core_1.Component({
            templateUrl: 'tabs.html'
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _a) || Object])
    ], TabsPage);
    return TabsPage;
    var _a;
}());
exports.TabsPage = TabsPage;
var E2EApp = (function () {
    function E2EApp() {
        this.root = Page1;
    }
    E2EApp = __decorate([
        core_1.Component({
            templateUrl: "./app.html"
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
                TabsPage,
                TabPage1,
                Page1,
                Page2,
                Page3,
                MyModal
            ],
            imports: [
                ionic_angular_1.IonicModule.forRoot(E2EApp, {
                    statusbarPadding: true
                })
            ],
            providers: [SomeData, OtherData],
            bootstrap: [ionic_angular_1.IonicApp],
            entryComponents: [
                TabsPage,
                TabPage1,
                Page1,
                Page2,
                Page3,
                MyModal
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;