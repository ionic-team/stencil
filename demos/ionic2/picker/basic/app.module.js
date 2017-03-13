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
    function E2EPage(navCtrl, pickerCtrl) {
        this.navCtrl = navCtrl;
        this.pickerCtrl = pickerCtrl;
    }
    E2EPage.prototype.push = function () {
        this.navCtrl.push(E2EPage);
    };
    E2EPage.prototype.twoColumns = function () {
        var _this = this;
        var picker = this.pickerCtrl.create({
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel'
                },
                {
                    text: 'Done',
                    handler: function (data) {
                        _this.smoothie = data.flavor1.value + " " + data.flavor2.value;
                    }
                }
            ],
            columns: [
                {
                    name: 'flavor1',
                    align: 'right',
                    options: [
                        { text: 'Mango' },
                        { text: 'Banana' },
                        { text: 'Cherry' },
                        { text: 'Strawberry' },
                        { text: 'Raspberry' },
                        { text: 'Blueberry' },
                        { text: 'Peach' },
                        { text: 'Coconut' },
                        { text: 'Pineapple' },
                        { text: 'Honeydew' },
                        { text: 'Watermelon' },
                        { text: 'Grape' },
                        { text: 'Avocado' },
                        { text: 'Kiwi' },
                        { text: 'Orange' },
                        { text: 'Papaya' },
                    ]
                },
                {
                    name: 'flavor2',
                    align: 'left',
                    options: [
                        { text: 'Banana' },
                        { text: 'Orange' },
                        { text: 'Grape' },
                        { text: 'Watermelon' },
                        { text: 'Strawberry' },
                        { text: 'Papaya' },
                        { text: 'Kiwi' },
                        { text: 'Cherry' },
                        { text: 'Raspberry' },
                        { text: 'Mango' },
                        { text: 'Pineapple' },
                        { text: 'Peach' },
                        { text: 'Avocado' },
                        { text: 'Honeydew' },
                        { text: 'Blueberry' },
                        { text: 'Coconut' },
                    ]
                },
            ]
        });
        picker.present();
    };
    E2EPage.prototype.prefixLabel = function () {
        var _this = this;
        var picker = this.pickerCtrl.create({
            buttons: [
                {
                    text: 'Nerp',
                    role: 'cancel'
                },
                {
                    text: 'Woot!',
                    handler: function (data) {
                        _this.smoothie = "" + data.flavor1.value;
                    }
                }
            ],
            columns: [
                {
                    name: 'flavor1',
                    align: 'left',
                    prefix: 'Flavor',
                    options: [
                        { text: 'Mango' },
                        { text: 'Banana' },
                        { text: 'Cherry' },
                        { text: 'Strawberry' },
                        { text: 'Raspberry' },
                        { text: 'Blueberry' },
                        { text: 'Peach' },
                        { text: 'Coconut' },
                        { text: 'Pineapple' },
                        { text: 'Honeydew' },
                        { text: 'Watermelon' },
                        { text: 'Grape' },
                        { text: 'Avocado' },
                        { text: 'Kiwi' },
                        { text: 'Orange' },
                        { text: 'Papaya' },
                    ]
                }
            ]
        });
        picker.present();
    };
    E2EPage.prototype.suffixLabel = function () {
        var _this = this;
        var picker = this.pickerCtrl.create({
            buttons: [
                {
                    text: 'No',
                    role: 'cancel'
                },
                {
                    text: 'Si',
                    handler: function (data) {
                        _this.smoothie = "" + data.flavor1.value;
                    }
                }
            ],
            columns: [
                {
                    name: 'flavor1',
                    align: 'right',
                    suffix: 'flavor',
                    options: [
                        { text: 'Mango' },
                        { text: 'Banana' },
                        { text: 'Cherry' },
                        { text: 'Strawberry' },
                        { text: 'Raspberry' },
                        { text: 'Blueberry' },
                        { text: 'Peach' },
                        { text: 'Coconut' },
                        { text: 'Pineapple' },
                        { text: 'Honeydew' },
                        { text: 'Watermelon' },
                        { text: 'Grape' },
                        { text: 'Avocado' },
                        { text: 'Kiwi' },
                        { text: 'Orange' },
                        { text: 'Papaya' },
                    ]
                }
            ]
        });
        picker.present();
    };
    E2EPage.prototype.columnSizes = function () {
        var _this = this;
        var picker = this.pickerCtrl.create();
        picker.addButton({
            text: 'Cancel',
            role: 'cancel'
        });
        picker.addButton({
            text: 'Set Timer',
            handler: function (data) {
                _this.timer = data.hour.value + ":" + data.min.value;
            }
        });
        picker.addColumn({
            name: 'hour',
            suffix: 'hour',
            optionsWidth: '50px',
            align: 'right',
            options: Array.apply(null, { length: 23 }).map(Number.call, Number)
        });
        var minuteOptions = [];
        for (var i = 0; i < 60; i++) {
            minuteOptions.push({
                text: i,
                value: ('0' + i).slice(-2)
            });
        }
        picker.addColumn({
            name: 'min',
            suffix: 'min',
            optionsWidth: '80px',
            align: 'left',
            options: minuteOptions
        });
        picker.present();
    };
    E2EPage = __decorate([
        core_1.Component({
            templateUrl: 'main.html',
            encapsulation: core_1.ViewEncapsulation.None,
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _a) || Object, (typeof (_b = typeof ionic_angular_1.PickerController !== 'undefined' && ionic_angular_1.PickerController) === 'function' && _b) || Object])
    ], E2EPage);
    return E2EPage;
    var _a, _b;
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