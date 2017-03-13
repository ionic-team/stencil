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
    function E2EPage(actionSheetCtrl, alertCtrl, modalCtrl, plt) {
        this.actionSheetCtrl = actionSheetCtrl;
        this.alertCtrl = alertCtrl;
        this.modalCtrl = modalCtrl;
        this.plt = plt;
        this.result = '';
    }
    E2EPage.prototype.presentActionSheet1 = function () {
        var _this = this;
        this.result = '';
        this.actionSheetCtrl.create()
            .setTitle('Albums')
            .addButton({
            text: 'Delete',
            role: 'destructive',
            icon: 'trash',
            handler: function () {
                console.log('Delete clicked');
                _this.result = 'Deleted';
            }
        })
            .addButton({
            text: 'Share',
            icon: 'share',
            handler: function () {
                console.log('Share clicked');
                _this.result = 'Shared';
            }
        })
            .addButton({
            text: 'Play (open modal)',
            icon: 'arrow-dropright-circle',
            handler: function () {
                _this.result = 'Play (open modal)';
                var modal = _this.modalCtrl.create(ModalPage);
                modal.present();
                // returning false does not allow the actionsheet to be closed
                return false;
            }
        })
            .addButton({
            text: 'Favorite',
            icon: !this.plt.is('ios') ? 'heart' : null,
            handler: function () {
                console.log('Favorite clicked');
                _this.result = 'Favorited';
            }
        })
            .addButton({
            text: 'Cancel',
            role: 'cancel',
            icon: !this.plt.is('ios') ? 'close' : null,
            handler: function () {
                console.log('Cancel clicked');
                _this.result = 'Canceled';
            }
        })
            .present();
    };
    E2EPage.prototype.presentActionSheet2 = function () {
        var _this = this;
        this.result = '';
        var actionSheet = this.actionSheetCtrl.create({
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'Archive',
                    handler: function () {
                        console.log('Archive clicked');
                        _this.result = 'Archived';
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function () {
                        console.log('cancel this clicked');
                        _this.result = 'Canceled';
                    }
                },
                {
                    text: 'Destructive',
                    role: 'destructive',
                    handler: function () {
                        console.log('Destructive clicked');
                        _this.result = 'Destructive';
                    }
                }
            ],
            cssClass: 'my-action-sheet another-action-sheet-class'
        });
        actionSheet.present(actionSheet);
    };
    E2EPage.prototype.presentActionSheet3 = function () {
        var _this = this;
        this.result = '';
        var actionSheet = this.actionSheetCtrl.create({
            buttons: [
                {
                    text: 'Open Alert',
                    handler: function () {
                        _this.result = 'Opened alert';
                        var alert = _this.alertCtrl.create();
                        alert.setTitle('Alert!');
                        alert.setMessage('Alert opened from an action sheet');
                        alert.addButton({
                            text: 'Cancel',
                            role: 'cancel',
                            handler: function () {
                                _this.result = 'pressed Cancel button in alert from action sheet';
                            }
                        });
                        alert.addButton({
                            text: 'Okay',
                            handler: function () {
                                _this.result = 'pressed Okay button in alert from action sheet';
                            }
                        });
                        alert.present().then(function () {
                            _this.result = 'Alert from action sheet opened';
                        });
                        // do not close the action sheet yet
                        return false;
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function () {
                        _this.result = 'Canceled';
                    }
                }
            ]
        });
        actionSheet.present();
    };
    E2EPage = __decorate([
        core_1.Component({
            templateUrl: 'main.html'
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.ActionSheetController !== 'undefined' && ionic_angular_1.ActionSheetController) === 'function' && _a) || Object, (typeof (_b = typeof ionic_angular_1.AlertController !== 'undefined' && ionic_angular_1.AlertController) === 'function' && _b) || Object, (typeof (_c = typeof ionic_angular_1.ModalController !== 'undefined' && ionic_angular_1.ModalController) === 'function' && _c) || Object, (typeof (_d = typeof ionic_angular_1.Platform !== 'undefined' && ionic_angular_1.Platform) === 'function' && _d) || Object])
    ], E2EPage);
    return E2EPage;
    var _a, _b, _c, _d;
}());
exports.E2EPage = E2EPage;
var ModalPage = (function () {
    function ModalPage(viewCtrl) {
        this.viewCtrl = viewCtrl;
    }
    ModalPage.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    ModalPage = __decorate([
        core_1.Component({
            template: "\n    <ion-header>\n      <ion-toolbar>\n        <ion-buttons start>\n          <button ion-button (click)=\"dismiss()\" strong>Close</button>\n        </ion-buttons>\n        <ion-title>Modal</ion-title>\n      </ion-toolbar>\n    </ion-header>\n    <ion-content padding>\n      Hi, I'm Bob, and I'm a modal.\n    </ion-content>\n  "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.ViewController !== 'undefined' && ionic_angular_1.ViewController) === 'function' && _a) || Object])
    ], ModalPage);
    return ModalPage;
    var _a;
}());
exports.ModalPage = ModalPage;
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
                ModalPage
            ],
            imports: [
                ionic_angular_1.IonicModule.forRoot(E2EApp)
            ],
            bootstrap: [ionic_angular_1.IonicApp],
            entryComponents: [
                E2EPage,
                ModalPage
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;