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
var SomeComponentProvider = (function () {
    function SomeComponentProvider(config) {
        this.config = config;
        console.log('SomeComponentProvider constructor');
    }
    SomeComponentProvider.prototype.getName = function () {
        return 'Jenny';
    };
    SomeComponentProvider = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.Config !== 'undefined' && ionic_angular_1.Config) === 'function' && _a) || Object])
    ], SomeComponentProvider);
    return SomeComponentProvider;
    var _a;
}());
exports.SomeComponentProvider = SomeComponentProvider;
var SomeAppProvider = (function () {
    function SomeAppProvider(config) {
        this.config = config;
        console.log('SomeAppProvider constructor');
    }
    SomeAppProvider.prototype.getData = function () {
        return 'Some data';
    };
    SomeAppProvider = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.Config !== 'undefined' && ionic_angular_1.Config) === 'function' && _a) || Object])
    ], SomeAppProvider);
    return SomeAppProvider;
    var _a;
}());
exports.SomeAppProvider = SomeAppProvider;
var E2EPage = (function () {
    function E2EPage(navCtrl, modalCtrl, toastCtrl, config, plt) {
        this.navCtrl = navCtrl;
        this.modalCtrl = modalCtrl;
        this.toastCtrl = toastCtrl;
        console.log('platforms', plt.platforms());
        console.log('mode', config.get('mode'));
        console.log('isRTL', plt.isRTL());
        console.log('core', plt.is('core'));
        console.log('cordova', plt.is('cordova'));
        console.log('mobile', plt.is('mobile'));
        console.log('mobileweb', plt.is('mobileweb'));
        console.log('ipad', plt.is('ipad'));
        console.log('iphone', plt.is('iphone'));
        console.log('phablet', plt.is('phablet'));
        console.log('tablet', plt.is('tablet'));
        console.log('ios', plt.is('ios'));
        console.log('android', plt.is('android'));
        console.log('windows phone', plt.is('windows'));
        plt.ready().then(function (readySource) {
            console.log('platform.ready, readySource:', readySource);
        });
        this.platforms = plt.platforms();
    }
    E2EPage.prototype.push = function () {
        this.navCtrl.push(E2EPage);
    };
    E2EPage.prototype.presentModal = function () {
        var modal = this.modalCtrl.create(ModalPassData, { userId: 8675309 }, {
            enterAnimation: 'modal-slide-in',
            leaveAnimation: 'modal-slide-out'
        });
        modal.present();
        modal.onWillDismiss(function (data) {
            console.log('WILL DISMISS with data', data);
            console.timeEnd('modal');
        });
        modal.onDidDismiss(function (data) {
            console.log('DID DISMISS modal data', data);
            console.timeEnd('modal');
        });
    };
    E2EPage.prototype.presentModalChildNav = function () {
        this.modalCtrl.create(ContactUs, null, {
            enableBackdropDismiss: false
        }).present();
    };
    E2EPage.prototype.presentToolbarModal = function () {
        this.modalCtrl.create(ToolbarModal, null, {
            enterAnimation: 'modal-md-slide-in',
            leaveAnimation: 'modal-md-slide-out'
        }).present();
    };
    E2EPage.prototype.presentModalWithInputs = function () {
        var modal = this.modalCtrl.create(ModalWithInputs);
        modal.onDidDismiss(function (data) {
            console.log('Modal with inputs data:', data);
        });
        modal.present();
    };
    E2EPage.prototype.presentNavModalWithToast = function () {
        var _this = this;
        this.toastCtrl.create({
            message: 'Will present a modal with child nav...',
            duration: 1000,
        }).present();
        setTimeout(function () {
            _this.modalCtrl.create(ContactUs).present();
        }, 500);
    };
    E2EPage.prototype.presentToolbarModalWithToast = function () {
        var _this = this;
        this.toastCtrl.create({
            message: 'Will present a modal with toolbars...',
            duration: 1000,
        }).present();
        setTimeout(function () {
            _this.modalCtrl.create(ToolbarModal).present();
        }, 500);
    };
    E2EPage.prototype.ionViewDidLoad = function () {
        console.log('E2EPage ionViewDidLoad fired');
    };
    E2EPage.prototype.ionViewWillEnter = function () {
        console.log('E2EPage ionViewWillEnter fired');
    };
    E2EPage.prototype.ionViewDidEnter = function () {
        console.log('E2EPage ionViewDidEnter fired');
    };
    E2EPage.prototype.ionViewWillLeave = function () {
        console.log('E2EPage ionViewWillLeave fired');
    };
    E2EPage.prototype.ionViewDidLeave = function () {
        console.log('E2EPage ionViewDidLeave fired');
    };
    E2EPage = __decorate([
        core_1.Component({
            templateUrl: 'main.html'
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _a) || Object, (typeof (_b = typeof ionic_angular_1.ModalController !== 'undefined' && ionic_angular_1.ModalController) === 'function' && _b) || Object, (typeof (_c = typeof ionic_angular_1.ToastController !== 'undefined' && ionic_angular_1.ToastController) === 'function' && _c) || Object, (typeof (_d = typeof ionic_angular_1.Config !== 'undefined' && ionic_angular_1.Config) === 'function' && _d) || Object, (typeof (_e = typeof ionic_angular_1.Platform !== 'undefined' && ionic_angular_1.Platform) === 'function' && _e) || Object])
    ], E2EPage);
    return E2EPage;
    var _a, _b, _c, _d, _e;
}());
exports.E2EPage = E2EPage;
var ModalPassData = (function () {
    function ModalPassData(viewCtrl, toastCtrl, alertCtrl, params, someComponentProvider, someAppProvider) {
        this.viewCtrl = viewCtrl;
        this.toastCtrl = toastCtrl;
        this.alertCtrl = alertCtrl;
        this.data = {
            userId: params.get('userId'),
            name: someComponentProvider.getName()
        };
        console.log('SomeAppProvider Data', someAppProvider.getData());
        this.called = {
            ionViewCanEnter: 0,
            ionViewCanLeave: 0,
            ionViewWillLoad: 0,
            ionViewDidLoad: 0,
            ionViewWillEnter: 0,
            ionViewDidEnter: 0,
            ionViewWillLeave: 0,
            ionViewDidLeave: 0
        };
    }
    ModalPassData.prototype.submit = function () {
        console.time('modal');
        this.viewCtrl.dismiss(this.data).catch(function () {
            console.log('submit was cancelled');
        });
    };
    ModalPassData.prototype.ionViewCanEnter = function () {
        console.log('ModalPassData ionViewCanEnter fired');
        this.called.ionViewCanEnter++;
        return true;
    };
    ModalPassData.prototype.ionViewCanLeave = function () {
        var _this = this;
        console.log('ModalPassData ionViewCanLeave fired');
        this.called.ionViewCanLeave++;
        return new Promise(function (resolve, reject) {
            _this.alertCtrl.create()
                .setTitle('Do you want to submit?')
                .addButton({ text: 'Submit', handler: resolve })
                .addButton({ text: 'Cancel', role: 'cancel', handler: reject })
                .present();
        });
    };
    ModalPassData.prototype.ionViewWillLoad = function () {
        console.log('ModalPassData ionViewWillLoad fired');
        this.called.ionViewWillLoad++;
    };
    ModalPassData.prototype.ionViewDidLoad = function () {
        console.log('ModalPassData ionViewDidLoad fired');
        this.called.ionViewDidLoad++;
    };
    ModalPassData.prototype.ionViewWillEnter = function () {
        console.log('ModalPassData ionViewWillEnter fired');
        this.called.ionViewWillEnter++;
    };
    ModalPassData.prototype.ionViewDidEnter = function () {
        console.log('ModalPassData ionViewDidEnter fired');
        this.toastCtrl.create({
            message: 'test toast',
            duration: 1000
        }).present();
        this.called.ionViewDidEnter++;
    };
    ModalPassData.prototype.ionViewWillLeave = function () {
        console.log('ModalPassData ionViewWillLeave fired');
        this.called.ionViewWillLeave++;
    };
    ModalPassData.prototype.ionViewDidLeave = function () {
        console.log('ModalPassData ionViewDidLeave fired');
        this.called.ionViewDidLeave++;
    };
    ModalPassData = __decorate([
        core_1.Component({
            template: "\n    <ion-header>\n      <ion-navbar>\n        <ion-title>Data in/out</ion-title>\n      </ion-navbar>\n    </ion-header>\n    <ion-content>\n      <ion-list>\n        <ion-item>\n          <ion-label>UserId</ion-label>\n          <ion-input type=\"number\" [(ngModel)]=\"data.userId\"></ion-input>\n        </ion-item>\n        <ion-item>\n          <ion-label>Name</ion-label>\n          <ion-input [(ngModel)]=\"data.name\"></ion-input>\n        </ion-item>\n      </ion-list>\n      <button ion-button full (click)=\"submit()\">Submit</button>\n      <div padding>\n        <p>ionViewCanEnter ({{called.ionViewCanEnter}})</p>\n        <p>ionViewCanLeave ({{called.ionViewCanLeave}})</p>\n        <p>ionViewWillLoad ({{called.ionViewWillLoad}})</p>\n        <p>ionViewDidLoad ({{called.ionViewDidLoad}})</p>\n        <p>ionViewWillEnter ({{called.ionViewWillEnter}})</p>\n        <p>ionViewDidEnter ({{called.ionViewDidEnter}})</p>\n        <p>ionViewWillLeave ({{called.ionViewWillLeave}})</p>\n        <p>ionViewDidLeave ({{called.ionViewDidLeave}})</p>\n      </div>\n    </ion-content>\n  ",
            providers: [SomeComponentProvider]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.ViewController !== 'undefined' && ionic_angular_1.ViewController) === 'function' && _a) || Object, (typeof (_b = typeof ionic_angular_1.ToastController !== 'undefined' && ionic_angular_1.ToastController) === 'function' && _b) || Object, (typeof (_c = typeof ionic_angular_1.AlertController !== 'undefined' && ionic_angular_1.AlertController) === 'function' && _c) || Object, (typeof (_d = typeof ionic_angular_1.NavParams !== 'undefined' && ionic_angular_1.NavParams) === 'function' && _d) || Object, SomeComponentProvider, SomeAppProvider])
    ], ModalPassData);
    return ModalPassData;
    var _a, _b, _c, _d;
}());
exports.ModalPassData = ModalPassData;
var ToolbarModal = (function () {
    function ToolbarModal(viewCtrl, alertCtrl) {
        this.viewCtrl = viewCtrl;
        this.alertCtrl = alertCtrl;
    }
    ToolbarModal.prototype.ionViewDidEnter = function () {
        var alert = this.alertCtrl.create({
            title: 'Test',
            buttons: [
                {
                    text: 'Something',
                    role: 'cancel'
                }
            ]
        });
        alert.present();
    };
    ToolbarModal.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    ToolbarModal = __decorate([
        core_1.Component({
            template: "\n    <ion-header>\n      <ion-toolbar color=\"primary\">\n        <ion-title>Toolbar 1</ion-title>\n      </ion-toolbar>\n\n      <ion-toolbar>\n        <ion-title>Toolbar 2</ion-title>\n      </ion-toolbar>\n    </ion-header>\n\n    <ion-content padding>\n      <button ion-button block color=\"danger\" (click)=\"dismiss()\" class=\"e2eCloseToolbarModal\">\n        Dismission Modal\n      </button>\n\n      <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vel ipsum in purus mollis dictum eget vitae purus. Nulla ultrices est odio, a maximus velit pretium ac. Donec vel elementum mi. Proin elementum pulvinar neque, in lacinia nibh tempus auctor. Nam sapien velit, commodo ac nibh a, maximus ullamcorper nunc. Integer luctus tortor dignissim, dictum neque at, scelerisque purus. Vivamus nec erat vel magna posuere euismod. Sed ac augue eu tellus tincidunt fermentum eget sit amet nunc. Donec sit amet mi libero. Cras nunc arcu, ultrices nec sapien eu, convallis posuere libero. Pellentesque vulputate lacus eros, at lobortis lorem egestas et. Vestibulum tempus quam in efficitur lobortis. Maecenas consectetur consequat sem pharetra aliquet. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</div>\n\n      <div>Mauris ac ligula elit. Nulla pulvinar eget leo ut aliquet. Praesent sit amet luctus quam. Nam fringilla iaculis mi, ut maximus mauris molestie feugiat. Curabitur nec scelerisque elit. Nunc eu odio facilisis, tempor enim eget, venenatis sem. Sed vitae lorem vehicula, auctor orci ultrices, finibus mauris. Donec vitae pulvinar diam. Nulla luctus congue quam, sed lacinia arcu dictum a.</div>\n\n      <div>Morbi laoreet magna elit, id dapibus massa varius consequat. Praesent rhoncus nunc quam, eu mollis velit commodo ut. Etiam euismod elit mi, non auctor velit blandit ut. Aenean vitae pulvinar mi, ac pretium tellus. Morbi eu auctor sem, sollicitudin cursus felis. Praesent vestibulum velit sed eros iaculis ornare. Praesent diam diam, pellentesque eget scelerisque sed, bibendum ut risus. Sed sed fermentum sem. Integer vel justo felis. Proin eget quam est. In sit amet ipsum sagittis, convallis ipsum fringilla, interdum ante. Etiam vel tincidunt mauris. Nunc feugiat eros nunc, et vestibulum metus mollis et. Nullam eu viverra velit, id ultrices nisl. Donec non enim elementum, laoreet sapien id, feugiat tellus.</div>\n\n      <div>Sed pellentesque ipsum eget ante hendrerit maximus. Aliquam id venenatis nulla. Nullam in nibh at enim vestibulum ullamcorper. Nam felis dolor, lobortis vel est non, condimentum malesuada nisl. In metus sapien, malesuada at nulla in, pretium aliquam turpis. Quisque elementum purus mi, sed tristique turpis ultricies in. Donec feugiat dolor non ultricies ultricies. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Proin ut purus et diam porta cursus vitae semper mi. Donec fringilla tellus orci. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nunc vitae commodo sem. Duis vehicula quam sit amet imperdiet facilisis. Pellentesque eget dignissim neque, et scelerisque libero. Maecenas molestie metus sed orci cursus, in venenatis justo dapibus.</div>\n\n      <div>Aenean rhoncus urna at interdum blandit. Donec ac massa nec libero vehicula tincidunt. Sed sit amet hendrerit risus. Aliquam vitae vestibulum ipsum, non feugiat orci. Vivamus eu rutrum elit. Nulla dapibus tortor non dignissim pretium. Nulla in luctus turpis. Etiam non mattis tortor, at aliquet ex. Nunc ut ante varius, auctor dui vel, volutpat elit. Nunc laoreet augue sit amet ultrices porta. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Vestibulum pellentesque lobortis est, ut tincidunt ligula mollis sit amet. In porta risus arcu, quis pellentesque dolor mattis non. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;</div>\n\n      <button ion-button block color=\"danger\" (click)=\"dismiss()\">\n        Dismission Modal\n      </button>\n    </ion-content>\n  "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.ViewController !== 'undefined' && ionic_angular_1.ViewController) === 'function' && _a) || Object, (typeof (_b = typeof ionic_angular_1.AlertController !== 'undefined' && ionic_angular_1.AlertController) === 'function' && _b) || Object])
    ], ToolbarModal);
    return ToolbarModal;
    var _a, _b;
}());
exports.ToolbarModal = ToolbarModal;
var ModalWithInputs = (function () {
    function ModalWithInputs(viewCtrl) {
        this.viewCtrl = viewCtrl;
        this.data = {
            title: 'Title',
            note: 'Note',
            icon: 'home'
        };
    }
    ModalWithInputs.prototype.save = function (ev) {
        this.viewCtrl.dismiss(this.data);
    };
    ModalWithInputs.prototype.dismiss = function () {
        this.viewCtrl.dismiss(null);
    };
    ModalWithInputs = __decorate([
        core_1.Component({
            template: "\n    <ion-header>\n      <ion-toolbar color=\"secondary\">\n        <ion-buttons start>\n          <button ion-button (click)=\"dismiss()\" strong>Close</button>\n        </ion-buttons>\n        <ion-title>Modal w/ Inputs</ion-title>\n      </ion-toolbar>\n    </ion-header>\n\n    <ion-content>\n      <form #addForm=\"ngForm\" (submit)=\"save($event)\" novalidate>\n        <ion-list>\n          <ion-item>\n            <ion-label floating>Title <span [hidden]=\"data.title.valid\">(Required)</span></ion-label>\n            <ion-input [(ngModel)]=\"data.title\" name=\"title\" #title=\"ngModel\" type=\"text\" required autofocus></ion-input>\n          </ion-item>\n          <ion-item>\n            <ion-label floating>Note <span [hidden]=\"data.note.valid\">(Required)</span></ion-label>\n            <ion-input [(ngModel)]=\"data.note\" name=\"note\" #note=\"ngModel\" type=\"text\" required></ion-input>\n          </ion-item>\n          <ion-item>\n            <ion-label floating>Icon</ion-label>\n            <ion-input [(ngModel)]=\"data.icon\" name=\"icon\" #icon=\"ngModel\" type=\"text\" autocomplete=\"on\" autocorrect=\"on\"></ion-input>\n          </ion-item>\n        </ion-list>\n        <div padding>\n          <button ion-button block large type=\"submit\" [disabled]=\"!addForm.valid\">Save</button>\n        </div>\n      </form>\n    </ion-content>\n  "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.ViewController !== 'undefined' && ionic_angular_1.ViewController) === 'function' && _a) || Object])
    ], ModalWithInputs);
    return ModalWithInputs;
    var _a;
}());
exports.ModalWithInputs = ModalWithInputs;
var ContactUs = (function () {
    function ContactUs() {
        this.root = ModalFirstPage;
        console.log('ContactUs constructor');
    }
    ContactUs.prototype.ionViewDidLoad = function () {
        console.log('ContactUs ionViewDidLoad');
    };
    ContactUs.prototype.ionViewWillEnter = function () {
        console.log('ContactUs ionViewWillEnter');
    };
    ContactUs.prototype.ionViewDidEnter = function () {
        console.log('ContactUs ionViewDidEnter');
    };
    ContactUs.prototype.ionViewWillLeave = function () {
        console.log('ContactUs ionViewWillLeave');
    };
    ContactUs.prototype.ionViewDidLeave = function () {
        console.log('ContactUs ionViewDidLeave');
    };
    ContactUs.prototype.ionViewWillUnload = function () {
        console.log('ContactUs ionViewWillUnload');
    };
    ContactUs = __decorate([
        core_1.Component({
            template: '<ion-nav [root]="root"></ion-nav>'
        }), 
        __metadata('design:paramtypes', [])
    ], ContactUs);
    return ContactUs;
}());
exports.ContactUs = ContactUs;
var ModalFirstPage = (function () {
    function ModalFirstPage(navCtrl, app, actionSheetCtrl, toastCtrl, alertCtrl, modalCtrl) {
        this.navCtrl = navCtrl;
        this.app = app;
        this.actionSheetCtrl = actionSheetCtrl;
        this.toastCtrl = toastCtrl;
        this.alertCtrl = alertCtrl;
        this.modalCtrl = modalCtrl;
        this.items = [];
        for (var i = 0; i < 50; i++) {
            this.items.push({
                value: (i + 1)
            });
        }
        this.called = {
            ionViewCanEnter: 0,
            ionViewCanLeave: 0,
            ionViewWillLoad: 0,
            ionViewDidLoad: 0,
            ionViewWillEnter: 0,
            ionViewDidEnter: 0,
            ionViewWillLeave: 0,
            ionViewDidLeave: 0
        };
    }
    ModalFirstPage.prototype.push = function () {
        var _this = this;
        this.toastCtrl.create({
            message: 'Will push a page in a moment...',
            duration: 1000,
        }).present();
        setTimeout(function () {
            _this.navCtrl.push(ModalSecondPage, {
                id: 8675309,
                myData: [1, 2, 3, 4]
            });
        }, 500);
    };
    ModalFirstPage.prototype.dismiss = function () {
        this.navCtrl.parent.pop();
    };
    ModalFirstPage.prototype.ionViewCanEnter = function () {
        console.log('ModalFirstPage ionViewCanEnter fired');
        this.called.ionViewCanEnter++;
        return true;
    };
    ModalFirstPage.prototype.ionViewCanLeave = function () {
        console.log('ModalFirstPage ionViewCanLeave fired');
        this.called.ionViewCanLeave++;
        return true;
    };
    ModalFirstPage.prototype.ionViewWillLoad = function () {
        console.log('ModalFirstPage ionViewWillLoad fired');
        this.called.ionViewWillLoad++;
    };
    ModalFirstPage.prototype.ionViewDidLoad = function () {
        console.log('ModalFirstPage ionViewDidLoad fired');
        this.called.ionViewDidLoad++;
    };
    ModalFirstPage.prototype.ionViewWillEnter = function () {
        console.log('ModalFirstPage ionViewWillEnter fired');
        this.called.ionViewWillEnter++;
    };
    ModalFirstPage.prototype.ionViewDidEnter = function () {
        console.log('ModalFirstPage ionViewDidEnter fired');
        var alert = this.alertCtrl.create({
            title: 'Test',
            buttons: [
                {
                    text: 'Something',
                    role: 'cancel'
                }
            ]
        });
        alert.present();
        this.called.ionViewDidEnter++;
    };
    ModalFirstPage.prototype.ionViewWillLeave = function () {
        console.log('ModalFirstPage ionViewWillLeave fired');
        this.called.ionViewWillLeave++;
    };
    ModalFirstPage.prototype.ionViewDidLeave = function () {
        console.log('ModalFirstPage ionViewDidLeave fired');
        this.called.ionViewDidLeave++;
    };
    ModalFirstPage.prototype.openModal = function () {
        this.modalCtrl.create(ContactUs).present();
    };
    ModalFirstPage.prototype.openActionSheet = function () {
        var _this = this;
        var actionSheet = this.actionSheetCtrl.create({
            buttons: [
                {
                    text: 'Destructive',
                    role: 'destructive',
                    handler: function () {
                        console.log('Destructive clicked');
                    }
                },
                {
                    text: 'Archive',
                    handler: function () {
                        console.log('Archive clicked');
                    }
                },
                {
                    text: 'Go To Root',
                    handler: function () {
                        actionSheet.dismiss().then(function () {
                            _this.navCtrl.parent.pop();
                        });
                        // by default an alert will dismiss itself
                        // however, we don't want to use the default
                        // but rather fire off our own pop navigation
                        // return false so it doesn't pop automatically
                        return false;
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function () {
                        console.log('cancel this clicked');
                    }
                }
            ]
        });
        actionSheet.present();
    };
    ModalFirstPage = __decorate([
        core_1.Component({
            template: "\n    <ion-header>\n      <ion-navbar>\n        <ion-title>First Page Header</ion-title>\n        <ion-buttons start>\n          <button ion-button class=\"e2eCloseMenu\" (click)=\"dismiss()\" strong>Close</button>\n        </ion-buttons>\n      </ion-navbar>\n    </ion-header>\n\n    <ion-content padding>\n      <p>ionViewCanEnter ({{called.ionViewCanEnter}})</p>\n      <p>ionViewCanLeave ({{called.ionViewCanLeave}})</p>\n      <p>ionViewWillLoad ({{called.ionViewWillLoad}})</p>\n      <p>ionViewDidLoad ({{called.ionViewDidLoad}})</p>\n      <p>ionViewWillEnter ({{called.ionViewWillEnter}})</p>\n      <p>ionViewDidEnter ({{called.ionViewDidEnter}})</p>\n      <p>ionViewWillLeave ({{called.ionViewWillLeave}})</p>\n      <p>ionViewDidLeave ({{called.ionViewDidLeave}})</p>\n      <p>\n        <button ion-button (click)=\"push()\">Push (Go to 2nd)</button>\n      </p>\n      <p>\n        <button ion-button (click)=\"openActionSheet()\">Open Action Sheet</button>\n      </p>\n      <p>\n        <button ion-button (click)=\"openModal()\">Open same modal</button>\n      </p>\n      <div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div>\n      <div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div>\n      <ion-list>\n        <ion-item *ngFor=\"let item of items\">\n          Item Number: {{item.value}}\n        </ion-item>\n      </ion-list>\n    </ion-content>\n  "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _a) || Object, (typeof (_b = typeof ionic_angular_1.App !== 'undefined' && ionic_angular_1.App) === 'function' && _b) || Object, (typeof (_c = typeof ionic_angular_1.ActionSheetController !== 'undefined' && ionic_angular_1.ActionSheetController) === 'function' && _c) || Object, (typeof (_d = typeof ionic_angular_1.ToastController !== 'undefined' && ionic_angular_1.ToastController) === 'function' && _d) || Object, (typeof (_e = typeof ionic_angular_1.AlertController !== 'undefined' && ionic_angular_1.AlertController) === 'function' && _e) || Object, (typeof (_f = typeof ionic_angular_1.ModalController !== 'undefined' && ionic_angular_1.ModalController) === 'function' && _f) || Object])
    ], ModalFirstPage);
    return ModalFirstPage;
    var _a, _b, _c, _d, _e, _f;
}());
exports.ModalFirstPage = ModalFirstPage;
var ModalSecondPage = (function () {
    function ModalSecondPage(navCtrl, params) {
        this.navCtrl = navCtrl;
        console.log('Second page params:', params);
    }
    ModalSecondPage.prototype.ionViewDidLoad = function () {
        console.log('ModalSecondPage ionViewDidLoad');
    };
    ModalSecondPage.prototype.ionViewWillEnter = function () {
        console.log('ModalSecondPage ionViewWillEnter');
    };
    ModalSecondPage.prototype.ionViewDidEnter = function () {
        console.log('ModalSecondPage ionViewDidEnter');
    };
    ModalSecondPage = __decorate([
        core_1.Component({
            template: "\n    <ion-header>\n      <ion-navbar>\n        <ion-title>Second Page Header</ion-title>\n      </ion-navbar>\n    </ion-header>\n    <ion-content padding>\n      <p>\n        <button ion-button (click)=\"navCtrl.pop()\">Pop (Go back to 1st)</button>\n      </p>\n      <div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div>\n      <div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div>\n    </ion-content>\n  "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _a) || Object, (typeof (_b = typeof ionic_angular_1.NavParams !== 'undefined' && ionic_angular_1.NavParams) === 'function' && _b) || Object])
    ], ModalSecondPage);
    return ModalSecondPage;
    var _a, _b;
}());
exports.ModalSecondPage = ModalSecondPage;
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
                ModalFirstPage,
                ModalSecondPage,
                ModalWithInputs,
                ContactUs,
                ModalPassData,
                ToolbarModal
            ],
            imports: [
                ionic_angular_1.IonicModule.forRoot(E2EApp, {
                    statusbarPadding: true,
                    swipeBackEnabled: true
                })
            ],
            bootstrap: [ionic_angular_1.IonicApp],
            providers: [SomeAppProvider],
            entryComponents: [
                E2EApp,
                E2EPage,
                ModalFirstPage,
                ModalSecondPage,
                ModalWithInputs,
                ContactUs,
                ModalPassData,
                ToolbarModal
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;