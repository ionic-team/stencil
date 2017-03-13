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
var E2EPage = (function () {
    function E2EPage(nav, alertCtrl, toastCtrl) {
        this.nav = nav;
        this.alertCtrl = alertCtrl;
        this.toastCtrl = toastCtrl;
        this.items = [];
        this.slidingEnabled = true;
        this.moreText = 'Dynamic More';
        this.archiveText = 'Dynamic Archive';
        this.showOptions = false;
        for (var x = 0; x < 5; x++) {
            this.items.push(x);
        }
    }
    E2EPage.prototype.toggleSliding = function () {
        this.slidingEnabled = !this.slidingEnabled;
    };
    E2EPage.prototype.changeDynamic = function () {
        if (this.moreText.includes('Dynamic')) {
            this.moreText = 'Changed More';
            this.archiveText = 'Changed Archive';
            this.showOptions = true;
        }
        else {
            this.moreText = 'Dynamic More';
            this.archiveText = 'Dynamic Archive';
            this.showOptions = false;
        }
    };
    E2EPage.prototype.closeOpened = function () {
        this.list.closeSlidingItems();
    };
    E2EPage.prototype.noclose = function (item) {
        console.log('no close', item);
    };
    E2EPage.prototype.unread = function (item) {
        if (item) {
            item.close();
        }
        console.log('UNREAD', item);
    };
    E2EPage.prototype.didClick = function (item) {
        console.log('Clicked, ion-item');
        var alert = this.alertCtrl.create({
            title: 'Clicked ion-item!',
            buttons: ['Ok']
        });
        alert.present();
    };
    E2EPage.prototype.archive = function (item) {
        console.log('Archive, ion-item-options button', item);
        var alert = this.alertCtrl.create({
            title: 'Archived!',
            buttons: [{
                    text: 'Ok',
                    handler: function () {
                        item.close();
                    }
                }]
        });
        alert.present();
    };
    E2EPage.prototype.del = function (item) {
        console.log('Delete ion-item-options button', item);
        var alert = this.alertCtrl.create({
            title: 'Deleted!',
            buttons: [{
                    text: 'Ok',
                    handler: function () {
                        item.close();
                    }
                }]
        });
        alert.present();
    };
    E2EPage.prototype.download = function (item) {
        var _this = this;
        item.setElementClass('downloading', true);
        setTimeout(function () {
            var toast = _this.toastCtrl.create({
                message: 'Item was downloaded!'
            });
            toast.present();
            item.setElementClass('downloading', false);
            item.close();
            setTimeout(function () {
                toast.dismiss();
            }, 2000);
        }, 1500);
    };
    E2EPage.prototype.reload = function () {
        window.location.reload();
    };
    __decorate([
        core_1.ViewChild('myList', { read: ionic_angular_1.List }), 
        __metadata('design:type', (typeof (_a = typeof ionic_angular_1.List !== 'undefined' && ionic_angular_1.List) === 'function' && _a) || Object)
    ], E2EPage.prototype, "list", void 0);
    E2EPage = __decorate([
        core_1.Component({
            templateUrl: 'main.html'
        }), 
        __metadata('design:paramtypes', [(typeof (_b = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _b) || Object, (typeof (_c = typeof ionic_angular_1.AlertController !== 'undefined' && ionic_angular_1.AlertController) === 'function' && _c) || Object, (typeof (_d = typeof ionic_angular_1.ToastController !== 'undefined' && ionic_angular_1.ToastController) === 'function' && _d) || Object])
    ], E2EPage);
    return E2EPage;
    var _a, _b, _c, _d;
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