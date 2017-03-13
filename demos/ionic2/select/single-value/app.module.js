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
var forms_1 = require('@angular/forms');
var ionic_angular_1 = require('../../../../../ionic-angular');
var E2EPage = (function () {
    function E2EPage() {
        this.musicSelectOpts = {
            title: '1994 Music',
            subTitle: 'Select your favorite',
            cssClass: 'music-select'
        };
        this.notificationSelectOpts = {
            title: 'Mute notifications',
            cssClass: 'notification-select'
        };
        this.gaming = '';
        this.os = 'win3.1';
        this.years = [1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999];
        this.music = null;
        this.month = '12';
        this.year = '1994';
        this.notification = 'enable';
        this.status = 'checked';
        this.currencies = [
            {
                symbol: '$',
                code: 'USD',
                name: 'US Dollar'
            },
            {
                symbol: '€',
                code: 'EUR',
                name: 'Euro'
            },
            {
                symbol: '£',
                code: 'FKP',
                name: 'Falkland Islands Pound'
            },
            {
                symbol: '¢',
                code: 'GHS',
                name: 'Ghana Cedi'
            }
        ];
        this.fruitCtrl = new forms_1.FormControl({ value: 'grape', disabled: true });
        this.fruitsForm = new forms_1.FormGroup({
            'fruit': this.fruitCtrl
        });
        this.currency = this.currencies[0];
    }
    E2EPage.prototype.gamingCancel = function () {
        console.log('Gaming Select, Cancel');
    };
    E2EPage.prototype.gamingChange = function (selectedValue) {
        console.log('Gaming Select, Change value:', selectedValue);
    };
    E2EPage.prototype.musicSelect = function (selectedValue) {
        console.log('Music selected', selectedValue);
    };
    E2EPage.prototype.notificationSelect = function (selectedValue) {
        console.log('Notification select', selectedValue);
    };
    E2EPage.prototype.statusChange = function (ev) {
        this.status = ev;
    };
    E2EPage.prototype.resetGender = function () {
        this.gender = null;
    };
    E2EPage.prototype.selectedText = function () {
        return this.currency.symbol;
    };
    E2EPage = __decorate([
        core_1.Component({
            templateUrl: 'main.html'
        }), 
        __metadata('design:paramtypes', [])
    ], E2EPage);
    return E2EPage;
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