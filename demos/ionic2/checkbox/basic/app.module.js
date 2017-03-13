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
        this.dangerColor = 'danger';
        this.appleCtrl = new forms_1.FormControl(true);
        this.bananaCtrl = new forms_1.FormControl(true);
        this.cherryCtrl = new forms_1.FormControl({ value: false, disabled: true });
        this.grapeCtrl = new forms_1.FormControl({ value: true, disabled: true });
        this.fruitsForm = new forms_1.FormGroup({
            'apple': this.appleCtrl,
            'banana': this.bananaCtrl,
            'cherry': this.cherryCtrl,
            'grape': this.grapeCtrl
        });
        this.checked = false;
        this.disabled = false;
        this.grapeChecked = true;
        this.standAloneChecked = true;
    }
    E2EPage.prototype.toggleGrapeChecked = function () {
        this.grapeChecked = !this.grapeChecked;
    };
    E2EPage.prototype.toggleGrapeDisabled = function () {
        this.fruitsForm.get('grape').enabled ? this.fruitsForm.get('grape').disable() : this.fruitsForm.get('grape').enable();
    };
    E2EPage.prototype.kiwiChange = function (checkbox) {
        console.log('kiwiChange', checkbox);
        this.kiwiValue = checkbox.checked;
    };
    E2EPage.prototype.strawberryChange = function (checkbox) {
        console.log('strawberryChange', checkbox);
        this.strawberryValue = checkbox.checked;
    };
    E2EPage.prototype.doSubmit = function (ev) {
        console.log('Submitting form', this.fruitsForm.value);
        this.formResults = JSON.stringify(this.fruitsForm.value);
        ev.preventDefault();
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
                E2EPage
            ],
            imports: [
                ionic_angular_1.IonicModule.forRoot(E2EApp)
            ],
            bootstrap: [ionic_angular_1.IonicApp],
            entryComponents: [
                E2EPage
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;