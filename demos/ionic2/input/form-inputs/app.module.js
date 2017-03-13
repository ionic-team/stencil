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
var forms_1 = require('@angular/forms');
var core_1 = require('@angular/core');
var ionic_angular_1 = require('../../../../../ionic-angular');
var E2EPage = (function () {
    function E2EPage(fb) {
        this.login = {
            email: 'help@ionic.io',
            username: 'admin',
            password: '',
            gender: '',
            comments: ''
        };
        this.submitted = false;
        this.loginForm = fb.group({
            email: ['', forms_1.Validators.compose([
                    forms_1.Validators.required,
                    this.emailValidator
                ])],
            username: [''],
            password: ['', forms_1.Validators.required],
            comments: ['', forms_1.Validators.required],
            gender: ['', forms_1.Validators.required]
        });
        this.userForm = fb.group({
            email: ['', forms_1.Validators.required],
            username: [{ value: 'administrator', disabled: true }, forms_1.Validators.required],
            password: [{ value: 'password', disabled: false }, forms_1.Validators.required],
            comments: [{ value: 'Comments are disabled', disabled: true }, forms_1.Validators.required]
        });
    }
    E2EPage.prototype.emailValidator = function (control) {
        var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
        if (!EMAIL_REGEXP.test(control.value)) {
            return { invalidEmail: true };
        }
    };
    E2EPage.prototype.submit = function (ev, value) {
        console.log('Submitted', value);
        this.submitted = true;
    };
    E2EPage.prototype.disable = function () {
        this.isTextAreaDisabled = !this.isTextAreaDisabled;
    };
    E2EPage.prototype.toggleDisable = function () {
        var userNameCtrl = this.userForm.get('username');
        userNameCtrl.enabled ? userNameCtrl.disable() : userNameCtrl.enable();
        var commentsCtrl = this.userForm.get('comments');
        commentsCtrl.enabled ? commentsCtrl.disable() : commentsCtrl.enable();
    };
    E2EPage = __decorate([
        core_1.Component({
            templateUrl: 'main.html'
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof forms_1.FormBuilder !== 'undefined' && forms_1.FormBuilder) === 'function' && _a) || Object])
    ], E2EPage);
    return E2EPage;
    var _a;
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
                E2EPage
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;