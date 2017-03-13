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
var Page1 = (function () {
    function Page1() {
        this.singleValue2 = 150;
        this.singleValue3 = 64;
        this.singleValue4 = 1300;
        this.dualValue2 = { lower: 33, upper: 60 };
        this.rangeCtrl = new forms_1.FormControl({ value: '66', disabled: true });
        this.dualRangeCtrl = new forms_1.FormControl({ value: { lower: 33, upper: 60 }, disabled: true });
        this.rangeForm = new forms_1.FormGroup({
            'range': this.rangeCtrl,
            'dualRange': this.dualRangeCtrl
        });
    }
    Page1.prototype.rangeChange = function (range) {
        console.log("range, change, ratio: " + range.ratio + ", value: " + range.value);
    };
    Page1 = __decorate([
        core_1.Component({
            templateUrl: 'page1.html'
        }), 
        __metadata('design:paramtypes', [])
    ], Page1);
    return Page1;
}());
exports.Page1 = Page1;
var E2EApp = (function () {
    function E2EApp() {
        this.rootPage = Page1;
    }
    E2EApp = __decorate([
        core_1.Component({
            templateUrl: 'main.html'
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
                Page1
            ],
            imports: [
                ionic_angular_1.IonicModule.forRoot(E2EApp)
            ],
            bootstrap: [ionic_angular_1.IonicApp],
            entryComponents: [
                E2EApp,
                Page1
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;