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
var MainPage = (function () {
    function MainPage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    MainPage.prototype.goToSecond = function () {
        this.navCtrl.push(SearchPage);
    };
    MainPage = __decorate([
        core_1.Component({
            templateUrl: 'main.html'
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _a) || Object])
    ], MainPage);
    return MainPage;
    var _a;
}());
exports.MainPage = MainPage;
var ModalPage = (function () {
    function ModalPage(viewCtrl) {
        this.viewCtrl = viewCtrl;
    }
    ModalPage.prototype.close = function () {
        this.viewCtrl.dismiss();
    };
    ModalPage = __decorate([
        core_1.Component({
            templateUrl: 'modal.html'
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.ViewController !== 'undefined' && ionic_angular_1.ViewController) === 'function' && _a) || Object])
    ], ModalPage);
    return ModalPage;
    var _a;
}());
exports.ModalPage = ModalPage;
var SearchPage = (function () {
    function SearchPage(navCtrl, modalCtrl) {
        this.navCtrl = navCtrl;
        this.modalCtrl = modalCtrl;
        this.initializeItems();
    }
    SearchPage.prototype.showDetail = function (item) {
        this.navCtrl.push(DetailPage, { city: item });
    };
    SearchPage.prototype.initializeItems = function () {
        this.items = [
            'Amsterdam',
            'Bogota',
            'Buenos Aires',
            'Cairo',
            'Dhaka',
            'Edinburgh',
            'Geneva',
            'Genoa',
            'Glasglow',
            'Hanoi',
            'Hong Kong',
            'Islamabad',
            'Istanbul',
            'Jakarta',
            'Kiel',
            'Kyoto',
            'Le Havre',
            'Lebanon',
            'Lhasa',
            'Lima',
            'London',
            'Los Angeles',
            'Madrid',
            'Manila',
            'New York',
            'Olympia',
            'Oslo',
            'Panama City',
            'Peking',
            'Philadelphia',
            'San Francisco',
            'Seoul',
            'Taipeh',
            'Tel Aviv',
            'Tokio',
            'Uelzen',
            'Washington'
        ];
    };
    SearchPage.prototype.getItems = function (ev) {
        // Reset items back to all of the items
        this.initializeItems();
        // set q to the value of the searchbar
        var q = ev.target.value;
        // if the value is an empty string don't filter the items
        if (!q || q.trim() === '') {
            return;
        }
        this.items = this.items.filter(function (v) {
            if (v.toLowerCase().indexOf(q.toLowerCase()) > -1) {
                return true;
            }
            return false;
        });
    };
    SearchPage.prototype.openModal = function () {
        var modal = this.modalCtrl.create(ModalPage);
        modal.present();
    };
    SearchPage = __decorate([
        core_1.Component({
            templateUrl: 'search.html'
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _a) || Object, (typeof (_b = typeof ionic_angular_1.ModalController !== 'undefined' && ionic_angular_1.ModalController) === 'function' && _b) || Object])
    ], SearchPage);
    return SearchPage;
    var _a, _b;
}());
exports.SearchPage = SearchPage;
var DetailPage = (function () {
    function DetailPage(_navParams) {
        this._navParams = _navParams;
        this.city = _navParams.get('city');
    }
    DetailPage = __decorate([
        core_1.Component({
            templateUrl: 'detail.html'
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.NavParams !== 'undefined' && ionic_angular_1.NavParams) === 'function' && _a) || Object])
    ], DetailPage);
    return DetailPage;
    var _a;
}());
exports.DetailPage = DetailPage;
var TabsPage = (function () {
    function TabsPage() {
        this.mainPage = MainPage;
        this.searchPage = SearchPage;
    }
    TabsPage = __decorate([
        core_1.Component({
            templateUrl: 'tabs.html'
        }), 
        __metadata('design:paramtypes', [])
    ], TabsPage);
    return TabsPage;
}());
exports.TabsPage = TabsPage;
var E2EApp = (function () {
    function E2EApp() {
        this.root = TabsPage;
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
                MainPage,
                SearchPage,
                ModalPage,
                DetailPage,
                TabsPage
            ],
            imports: [
                ionic_angular_1.IonicModule.forRoot(E2EApp)
            ],
            bootstrap: [ionic_angular_1.IonicApp],
            entryComponents: [
                E2EApp,
                MainPage,
                SearchPage,
                ModalPage,
                DetailPage,
                TabsPage
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;