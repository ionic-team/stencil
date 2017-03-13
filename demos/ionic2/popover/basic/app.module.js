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
var PopoverRadioPage = (function () {
    function PopoverRadioPage(navParams) {
        this.navParams = navParams;
        this.colors = {
            'white': {
                'bg': 'rgb(255, 255, 255)',
                'fg': 'rgb(0, 0, 0)'
            },
            'tan': {
                'bg': 'rgb(249, 241, 228)',
                'fg': 'rgb(0, 0, 0)'
            },
            'grey': {
                'bg': 'rgb(76, 75, 80)',
                'fg': 'rgb(255, 255, 255)'
            },
            'black': {
                'bg': 'rgb(0, 0, 0)',
                'fg': 'rgb(255, 255, 255)'
            },
        };
    }
    PopoverRadioPage.prototype.ngOnInit = function () {
        if (this.navParams.data) {
            this.contentEle = this.navParams.data.contentEle;
            this.textEle = this.navParams.data.textEle;
            this.background = this.getColorName(this.contentEle.style.backgroundColor);
            this.setFontFamily();
        }
    };
    PopoverRadioPage.prototype.getColorName = function (background) {
        var colorName = 'white';
        if (!background)
            return 'white';
        for (var key in this.colors) {
            if (this.colors[key].bg === background) {
                colorName = key;
            }
        }
        return colorName;
    };
    PopoverRadioPage.prototype.setFontFamily = function () {
        if (this.textEle.style.fontFamily) {
            this.fontFamily = this.textEle.style.fontFamily.replace(/'/g, '');
        }
    };
    PopoverRadioPage.prototype.changeBackground = function (color) {
        this.background = color;
        this.contentEle.style.backgroundColor = this.colors[color].bg;
        this.textEle.style.color = this.colors[color].fg;
    };
    PopoverRadioPage.prototype.changeFontSize = function (direction) {
        this.textEle.style.fontSize = direction;
    };
    PopoverRadioPage.prototype.changeFontFamily = function () {
        if (this.fontFamily)
            this.textEle.style.fontFamily = this.fontFamily;
    };
    PopoverRadioPage = __decorate([
        core_1.Component({
            template: "\n    <ion-content>\n      <ion-list radio-group [(ngModel)]=\"fontFamily\" (ionChange)=\"changeFontFamily()\">\n        <ion-row>\n          <ion-col>\n            <button (click)=\"changeFontSize('smaller')\" ion-item detail-none class=\"text-button text-smaller\">A</button>\n          </ion-col>\n          <ion-col>\n            <button (click)=\"changeFontSize('larger')\" ion-item detail-none class=\"text-button text-larger\">A</button>\n          </ion-col>\n        </ion-row>\n        <ion-row class=\"row-dots\">\n          <ion-col>\n            <button ion-button=\"dot\" (click)=\"changeBackground('white')\" class=\"dot-white\" [class.selected]=\"background == 'white'\"></button>\n          </ion-col>\n          <ion-col>\n            <button ion-button=\"dot\" (click)=\"changeBackground('tan')\" class=\"dot-tan\" [class.selected]=\"background == 'tan'\"></button>\n          </ion-col>\n          <ion-col>\n            <button ion-button=\"dot\" (click)=\"changeBackground('grey')\" class=\"dot-grey\" [class.selected]=\"background == 'grey'\"></button>\n          </ion-col>\n          <ion-col>\n            <button ion-button=\"dot\" (click)=\"changeBackground('black')\" class=\"dot-black\" [class.selected]=\"background == 'black'\"></button>\n          </ion-col>\n        </ion-row>\n        <ion-item-divider color=\"dark\">\n          <ion-label>Font Family</ion-label>\n        </ion-item-divider>\n        <ion-item class=\"text-athelas\">\n          <ion-label>Athelas</ion-label>\n          <ion-radio value=\"Athelas\"></ion-radio>\n        </ion-item>\n        <ion-item class=\"text-charter\">\n          <ion-label>Charter</ion-label>\n          <ion-radio value=\"Charter\"></ion-radio>\n        </ion-item>\n        <ion-item class=\"text-iowan\">\n          <ion-label>Iowan</ion-label>\n          <ion-radio value=\"Iowan\"></ion-radio>\n        </ion-item>\n        <ion-item class=\"text-palatino\">\n          <ion-label>Palatino</ion-label>\n          <ion-radio value=\"Palatino\"></ion-radio>\n        </ion-item>\n        <ion-item class=\"text-san-francisco\">\n          <ion-label>San Francisco</ion-label>\n          <ion-radio value=\"San Francisco\"></ion-radio>\n        </ion-item>\n        <ion-item class=\"text-seravek\">\n          <ion-label>Seravek</ion-label>\n          <ion-radio value=\"Seravek\"></ion-radio>\n        </ion-item>\n        <ion-item class=\"text-times-new-roman\">\n          <ion-label>Times New Roman</ion-label>\n          <ion-radio value=\"Times New Roman\"></ion-radio>\n        </ion-item>\n      </ion-list>\n    </ion-content>\n  ",
            selector: 'e2e-popover-basic'
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.NavParams !== 'undefined' && ionic_angular_1.NavParams) === 'function' && _a) || Object])
    ], PopoverRadioPage);
    return PopoverRadioPage;
    var _a;
}());
exports.PopoverRadioPage = PopoverRadioPage;
var PopoverListPage = (function () {
    function PopoverListPage(viewCtrl) {
        this.viewCtrl = viewCtrl;
    }
    PopoverListPage.prototype.close = function () {
        this.viewCtrl.dismiss();
    };
    PopoverListPage = __decorate([
        core_1.Component({
            template: "\n    <ion-list style=\"margin-bottom: 0\">\n      <ion-list-header color=\"secondary\">Ionic</ion-list-header>\n      <button ion-item (click)=\"close()\">Learn Ionic</button>\n      <button ion-item (click)=\"close()\">Documentation</button>\n    </ion-list>\n    <div padding style=\"padding-top: 0\">\n      <p>Paragraph text</p>\n      Some more text and <span color=\"danger\">danger span</span>.\n    </div>\n  "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.ViewController !== 'undefined' && ionic_angular_1.ViewController) === 'function' && _a) || Object])
    ], PopoverListPage);
    return PopoverListPage;
    var _a;
}());
exports.PopoverListPage = PopoverListPage;
var PopoverLongListPage = (function () {
    function PopoverLongListPage() {
        this.items = [];
    }
    PopoverLongListPage.prototype.ngOnInit = function () {
        for (var i = 1; i < 21; i++) {
            this.items.push(i);
        }
    };
    PopoverLongListPage = __decorate([
        core_1.Component({
            template: "\n    <ion-content>\n      <ion-list>\n        <ion-list-header>Ionic</ion-list-header>\n        <button ion-item *ngFor=\"let item of items\">Item {{item}}</button>\n      </ion-list>\n    </ion-content>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], PopoverLongListPage);
    return PopoverLongListPage;
}());
exports.PopoverLongListPage = PopoverLongListPage;
var E2EPage = (function () {
    function E2EPage(popoverCtrl, toastCtrl) {
        this.popoverCtrl = popoverCtrl;
        this.toastCtrl = toastCtrl;
    }
    E2EPage.prototype.presentListPopover = function (ev) {
        var popover = this.popoverCtrl.create(PopoverListPage);
        popover.present({
            ev: ev
        });
    };
    E2EPage.prototype.presentLongListPopover = function (ev) {
        var popover = this.popoverCtrl.create(PopoverLongListPage, {}, {
            cssClass: 'my-popover popover-class'
        });
        popover.present({
            ev: ev
        });
    };
    E2EPage.prototype.presentRadioPopover = function (ev) {
        var popover = this.popoverCtrl.create(PopoverRadioPage, {
            contentEle: this.content.nativeElement,
            textEle: this.text.nativeElement
        });
        popover.present({
            ev: ev
        });
    };
    E2EPage.prototype.presentNoEventPopover = function () {
        this.popoverCtrl.create(PopoverListPage).present();
    };
    E2EPage.prototype.presentToast = function () {
        this.toastCtrl.create({
            message: 'Toast example',
            duration: 1000
        }).present();
    };
    __decorate([
        core_1.ViewChild('popoverContent', { read: core_1.ElementRef }), 
        __metadata('design:type', (typeof (_a = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _a) || Object)
    ], E2EPage.prototype, "content", void 0);
    __decorate([
        core_1.ViewChild('popoverText', { read: core_1.ElementRef }), 
        __metadata('design:type', (typeof (_b = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _b) || Object)
    ], E2EPage.prototype, "text", void 0);
    E2EPage = __decorate([
        core_1.Component({
            templateUrl: 'main.html',
            selector: 'e2e-popover-basic'
        }), 
        __metadata('design:paramtypes', [(typeof (_c = typeof ionic_angular_1.PopoverController !== 'undefined' && ionic_angular_1.PopoverController) === 'function' && _c) || Object, (typeof (_d = typeof ionic_angular_1.ToastController !== 'undefined' && ionic_angular_1.ToastController) === 'function' && _d) || Object])
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
            template: '<ion-nav [root]="root"></ion-nav>',
            encapsulation: core_1.ViewEncapsulation.None
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
                PopoverRadioPage,
                PopoverListPage,
                PopoverLongListPage
            ],
            imports: [
                ionic_angular_1.IonicModule.forRoot(E2EApp)
            ],
            bootstrap: [ionic_angular_1.IonicApp],
            entryComponents: [
                E2EApp,
                E2EPage,
                PopoverRadioPage,
                PopoverListPage,
                PopoverLongListPage
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;