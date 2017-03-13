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
        this.selectedTime = 60;
        this.fruitsCtrl = new forms_1.FormControl('apple');
        this.fruitsForm = new forms_1.FormGroup({
            'fruitsCtrl': this.fruitsCtrl
        });
        this.friendsCtrl = new forms_1.FormControl({ value: 'enemies', disabled: true });
        this.friendsForm = new forms_1.FormGroup({
            'friendsCtrl': this.friendsCtrl
        });
        this.currenciesControl = new forms_1.FormControl('EUR');
        this.currencyForm = new forms_1.FormGroup({
            'currenciesControl': this.currenciesControl
        });
        this.currencies = ['USD', 'EUR'];
        this.relationship = 'enemies';
        this.items = [
            { description: 'value undefined', value: undefined },
            { description: 'value false string', value: 'false' },
            { description: 'value false boolean', value: false },
            { description: 'value 0', value: 0 },
        ];
    }
    E2EPage.prototype.setApple = function () {
        this.fruitsCtrl.updateValueAndValidity('apple');
    };
    E2EPage.prototype.setBanana = function () {
        this.fruitsCtrl.updateValueAndValidity('banana');
    };
    E2EPage.prototype.setCherry = function () {
        this.fruitsCtrl.updateValueAndValidity('cherry');
    };
    E2EPage.prototype.doSubmit = function (ev) {
        console.log('Submitting form', this.fruitsForm.value);
        ev.preventDefault();
    };
    E2EPage.prototype.petChange = function (radioGroup) {
        console.log('petChange', radioGroup);
    };
    E2EPage.prototype.dogSelect = function (radioButton) {
        console.log('dogSelect', radioButton);
    };
    E2EPage.prototype.catSelect = function (radioButton) {
        console.log('catSelect', radioButton);
    };
    E2EPage.prototype.turtleSelect = function (radioButton) {
        console.log('turtleSelect', radioButton);
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