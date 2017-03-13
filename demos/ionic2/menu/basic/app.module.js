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
    function Page1(navCtrl, alertCtrl, modalCtrl) {
        this.navCtrl = navCtrl;
        this.alertCtrl = alertCtrl;
        this.modalCtrl = modalCtrl;
        this.myMenu = 'right';
    }
    Page1.prototype.presentAlert = function () {
        var alert = this.alertCtrl.create({
            title: 'New Friend!',
            message: 'Your friend, Obi wan Kenobi, just accepted your friend request!',
            cssClass: 'my-alert',
            buttons: ['Ok']
        });
        alert.present();
    };
    Page1.prototype.presentModal = function () {
        var modal = this.modalCtrl.create(Modal);
        modal.present();
    };
    Page1.prototype.goToPage2 = function () {
        this.navCtrl.push(Page2);
    };
    Page1 = __decorate([
        core_1.Component({
            templateUrl: 'page1.html'
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _a) || Object, (typeof (_b = typeof ionic_angular_1.AlertController !== 'undefined' && ionic_angular_1.AlertController) === 'function' && _b) || Object, (typeof (_c = typeof ionic_angular_1.ModalController !== 'undefined' && ionic_angular_1.ModalController) === 'function' && _c) || Object])
    ], Page1);
    return Page1;
    var _a, _b, _c;
}());
exports.Page1 = Page1;
var Modal = (function () {
    function Modal(viewController) {
        this.viewController = viewController;
    }
    Modal.prototype.close = function () {
        this.viewController.dismiss();
    };
    Modal = __decorate([
        core_1.Component({ templateUrl: 'modal.html' }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.ViewController !== 'undefined' && ionic_angular_1.ViewController) === 'function' && _a) || Object])
    ], Modal);
    return Modal;
    var _a;
}());
exports.Modal = Modal;
var Page3 = (function () {
    function Page3() {
    }
    Page3 = __decorate([
        core_1.Component({ templateUrl: 'page3.html' }), 
        __metadata('design:paramtypes', [])
    ], Page3);
    return Page3;
}());
exports.Page3 = Page3;
var Page2 = (function () {
    function Page2(navCtrl) {
        this.navCtrl = navCtrl;
    }
    Page2.prototype.page3 = function () {
        this.navCtrl.push(Page3);
    };
    Page2 = __decorate([
        core_1.Component({ templateUrl: 'page2.html' }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _a) || Object])
    ], Page2);
    return Page2;
    var _a;
}());
exports.Page2 = Page2;
var E2EPage = (function () {
    function E2EPage(menuCtrl) {
        this.menuCtrl = menuCtrl;
        this.changeDetectionCount = 0;
        this.rootPage = Page1;
        this.pages = [
            { title: 'Page 1', component: Page1 },
            { title: 'Page 2', component: Page2 },
            { title: 'Page 3', component: Page3 },
        ];
    }
    E2EPage.prototype.openPage = function (page) {
        var _this = this;
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component).then(function () {
            // wait for the root page to be completely loaded
            // then close the menu
            _this.menuCtrl.close();
        });
    };
    E2EPage.prototype.openRightMenu = function () {
        this.menuCtrl.open('right');
    };
    E2EPage.prototype.openLeftMenu = function () {
        this.menuCtrl.open('left');
    };
    E2EPage.prototype.onDrag = function (ev) {
        console.log('Menu is being dragged', ev);
    };
    E2EPage.prototype.onOpen = function (ev) {
        console.log('Menu is open', ev);
    };
    E2EPage.prototype.onClose = function (ev) {
        console.log('Menu is closed', ev);
    };
    E2EPage.prototype.isChangeDetecting = function () {
        console.log('Change detection', ++this.changeDetectionCount);
        return true;
    };
    __decorate([
        core_1.ViewChild(ionic_angular_1.Nav), 
        __metadata('design:type', (typeof (_a = typeof ionic_angular_1.Nav !== 'undefined' && ionic_angular_1.Nav) === 'function' && _a) || Object)
    ], E2EPage.prototype, "nav", void 0);
    E2EPage = __decorate([
        core_1.Component({
            templateUrl: 'main.html'
        }), 
        __metadata('design:paramtypes', [(typeof (_b = typeof ionic_angular_1.MenuController !== 'undefined' && ionic_angular_1.MenuController) === 'function' && _b) || Object])
    ], E2EPage);
    return E2EPage;
    var _a, _b;
}());
exports.E2EPage = E2EPage;
var E2EApp = (function () {
    function E2EApp() {
        this.rootPage = E2EPage;
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
                E2EPage,
                Page1,
                Page2,
                Page3,
                Modal
            ],
            imports: [
                ionic_angular_1.IonicModule.forRoot(E2EApp)
            ],
            bootstrap: [ionic_angular_1.IonicApp],
            entryComponents: [
                E2EApp,
                E2EPage,
                Page1,
                Page2,
                Page3,
                Modal
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;