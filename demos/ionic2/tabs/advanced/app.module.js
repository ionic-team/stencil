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
// @DeepLink({ name: 'sign-in' })
var SignIn = (function () {
    function SignIn() {
        this.tabsPage = TabsPage;
    }
    SignIn = __decorate([
        core_1.Component({
            templateUrl: './signIn.html'
        }), 
        __metadata('design:paramtypes', [])
    ], SignIn);
    return SignIn;
}());
exports.SignIn = SignIn;
var ChatPage = (function () {
    function ChatPage(viewCtrl) {
        this.viewCtrl = viewCtrl;
    }
    ChatPage.prototype.ionViewDidLoad = function () {
        console.log('ChatPage, ionViewDidLoad');
    };
    ChatPage.prototype.ionViewWillUnload = function () {
        console.log('ChatPage, ionViewWillUnload');
    };
    ChatPage = __decorate([
        core_1.Component({
            templateUrl: './modalChat.html'
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.ViewController !== 'undefined' && ionic_angular_1.ViewController) === 'function' && _a) || Object])
    ], ChatPage);
    return ChatPage;
    var _a;
}());
exports.ChatPage = ChatPage;
// @DeepLink({ name: 'tabs' })
var TabsPage = (function () {
    function TabsPage(navCtrl, modalCtrl, params, alertCtrl) {
        this.navCtrl = navCtrl;
        this.modalCtrl = modalCtrl;
        this.params = params;
        this.alertCtrl = alertCtrl;
        this.showTab = false;
        this.rootPage1 = Tab1Page1;
        this.rootPage2 = Tab2Page1;
        this.rootPage3 = Tab3Page1;
    }
    TabsPage.prototype.ngAfterViewInit = function () {
        this.tabs.ionChange.subscribe(function (tab) {
            console.log('tabs.ionChange.subscribe', tab.index);
        });
    };
    TabsPage.prototype.onTabChange = function (tab) {
        this.showTab = tab.index !== 1;
        // wired up through the template
        // <ion-tabs (ionChange)="onTabChange()">
        console.log('onTabChange');
    };
    TabsPage.prototype.logout = function () {
        this.navCtrl.pop().catch(function () {
            console.log('Cannot go back.');
        });
    };
    TabsPage.prototype.ionViewCanLeave = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var alert = _this.alertCtrl.create({
                title: 'Log out',
                subTitle: 'Are you sure you want to log out?',
                buttons: [
                    {
                        text: 'No',
                        role: 'cancel',
                        handler: function () {
                            reject();
                        }
                    },
                    {
                        text: 'Yes',
                        handler: function () {
                            alert.dismiss().then(function () {
                                resolve();
                            });
                            return false;
                        }
                    }
                ]
            });
            alert.present();
        });
    };
    TabsPage.prototype.chat = function () {
        console.log('Chat clicked!');
        this.modalCtrl.create(ChatPage).present();
    };
    TabsPage.prototype.ionViewWillEnter = function () {
        console.log('TabsPage, ionViewWillEnter');
    };
    TabsPage.prototype.ionViewDidEnter = function () {
        console.log('TabsPage, ionViewDidEnter');
    };
    TabsPage.prototype.ionViewWillLeave = function () {
        console.log('TabsPage, ionViewWillLeave');
    };
    TabsPage.prototype.ionViewDidLeave = function () {
        console.log('TabsPage, ionViewDidLeave');
    };
    TabsPage.prototype.ionViewWillUnload = function () {
        console.log('TabsPage, ionViewWillUnload');
    };
    __decorate([
        core_1.ViewChild(ionic_angular_1.Tabs), 
        __metadata('design:type', (typeof (_a = typeof ionic_angular_1.Tabs !== 'undefined' && ionic_angular_1.Tabs) === 'function' && _a) || Object)
    ], TabsPage.prototype, "tabs", void 0);
    TabsPage = __decorate([
        core_1.Component({
            templateUrl: './tabs.html'
        }), 
        __metadata('design:paramtypes', [(typeof (_b = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _b) || Object, (typeof (_c = typeof ionic_angular_1.ModalController !== 'undefined' && ionic_angular_1.ModalController) === 'function' && _c) || Object, (typeof (_d = typeof ionic_angular_1.NavParams !== 'undefined' && ionic_angular_1.NavParams) === 'function' && _d) || Object, (typeof (_e = typeof ionic_angular_1.AlertController !== 'undefined' && ionic_angular_1.AlertController) === 'function' && _e) || Object])
    ], TabsPage);
    return TabsPage;
    var _a, _b, _c, _d, _e;
}());
exports.TabsPage = TabsPage;
//
// tab 1
//
// @DeepLink({ name: 'tab1-page1' })
var Tab1Page1 = (function () {
    function Tab1Page1(navCtrl, app, tabs, params) {
        this.navCtrl = navCtrl;
        this.app = app;
        this.tabs = tabs;
        this.params = params;
        this.tab1Page2 = Tab1Page2;
        this.userId = params.get('userId');
    }
    Tab1Page1.prototype.goBack = function () {
        console.log('go back begin');
        this.navCtrl.pop().then(function (val) {
            console.log('go back completed', val);
        });
    };
    Tab1Page1.prototype.favoritesTab = function () {
        this.tabs.select(1);
    };
    Tab1Page1.prototype.logout = function () {
        this.app.getRootNav().setRoot(SignIn, null, { animate: true, direction: 'back' }).catch(function () {
            console.debug('logout cancelled');
        });
    };
    Tab1Page1.prototype.ionViewWillEnter = function () {
        console.log('Tab1Page1, ionViewWillEnter');
    };
    Tab1Page1.prototype.ionViewDidEnter = function () {
        console.log('Tab1Page1, ionViewDidEnter');
    };
    Tab1Page1.prototype.ionViewWillLeave = function () {
        console.log('Tab1Page1, ionViewWillLeave');
    };
    Tab1Page1.prototype.ionViewDidLeave = function () {
        console.log('Tab1Page1, ionViewDidLeave');
    };
    Tab1Page1.prototype.ionViewWillUnload = function () {
        console.log('Tab1Page1, ionViewWillUnload');
    };
    Tab1Page1 = __decorate([
        core_1.Component({
            templateUrl: './tab1page1.html'
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _a) || Object, (typeof (_b = typeof ionic_angular_1.App !== 'undefined' && ionic_angular_1.App) === 'function' && _b) || Object, (typeof (_c = typeof ionic_angular_1.Tabs !== 'undefined' && ionic_angular_1.Tabs) === 'function' && _c) || Object, (typeof (_d = typeof ionic_angular_1.NavParams !== 'undefined' && ionic_angular_1.NavParams) === 'function' && _d) || Object])
    ], Tab1Page1);
    return Tab1Page1;
    var _a, _b, _c, _d;
}());
exports.Tab1Page1 = Tab1Page1;
// @DeepLink({ name: 'tab1-page2' })
var Tab1Page2 = (function () {
    function Tab1Page2(tabs) {
        this.tabs = tabs;
        this.tab1Page3 = Tab1Page3;
    }
    Tab1Page2.prototype.favoritesTab = function () {
        // TODO fix this with tabsHideOnSubPages=true
        this.tabs.select(1);
    };
    Tab1Page2.prototype.ionViewWillEnter = function () {
        console.log('Tab1Page2, ionViewWillEnter');
    };
    Tab1Page2.prototype.ionViewDidEnter = function () {
        console.log('Tab1Page2, ionViewDidEnter');
    };
    Tab1Page2.prototype.ionViewWillLeave = function () {
        console.log('Tab1Page2, ionViewWillLeave');
    };
    Tab1Page2.prototype.ionViewDidLeave = function () {
        console.log('Tab1Page2, ionViewDidLeave');
    };
    Tab1Page2.prototype.ionViewWillUnload = function () {
        console.log('Tab1Page2, ionViewWillUnload');
    };
    Tab1Page2 = __decorate([
        core_1.Component({
            templateUrl: './tab1page2.html'
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.Tabs !== 'undefined' && ionic_angular_1.Tabs) === 'function' && _a) || Object])
    ], Tab1Page2);
    return Tab1Page2;
    var _a;
}());
exports.Tab1Page2 = Tab1Page2;
// @DeepLink({ name: 'tab1-page3' })
var Tab1Page3 = (function () {
    function Tab1Page3(navCtrl) {
        this.navCtrl = navCtrl;
    }
    Tab1Page3.prototype.ionViewWillEnter = function () {
        console.log('Tab1Page3, ionViewWillEnter');
    };
    Tab1Page3.prototype.ionViewDidEnter = function () {
        console.log('Tab1Page3, ionViewDidEnter');
    };
    Tab1Page3.prototype.ionViewWillLeave = function () {
        console.log('Tab1Page3, ionViewWillLeave');
    };
    Tab1Page3.prototype.ionViewDidLeave = function () {
        console.log('Tab1Page3, ionViewDidLeave');
    };
    Tab1Page3.prototype.ionViewWillUnload = function () {
        console.log('Tab1Page3, ionViewWillUnload');
    };
    Tab1Page3 = __decorate([
        core_1.Component({
            templateUrl: './tab1page3.html'
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _a) || Object])
    ], Tab1Page3);
    return Tab1Page3;
    var _a;
}());
exports.Tab1Page3 = Tab1Page3;
//
// tab 2
//
// @DeepLink({ name: 'tab2-page1' })
var Tab2Page1 = (function () {
    function Tab2Page1() {
        this.tab2Page2 = Tab2Page2;
    }
    Tab2Page1.prototype.ionViewWillEnter = function () {
        console.log('Tab2Page1, ionViewWillEnter');
    };
    Tab2Page1.prototype.ionViewDidEnter = function () {
        console.log('Tab2Page1, ionViewDidEnter');
    };
    Tab2Page1.prototype.ionViewWillLeave = function () {
        console.log('Tab2Page1, ionViewWillLeave');
    };
    Tab2Page1.prototype.ionViewDidLeave = function () {
        console.log('Tab2Page1, ionViewDidLeave');
    };
    Tab2Page1.prototype.ionViewWillUnload = function () {
        console.log('Tab2Page1, ionViewWillUnload');
    };
    Tab2Page1 = __decorate([
        core_1.Component({
            templateUrl: './tab2page1.html'
        }), 
        __metadata('design:paramtypes', [])
    ], Tab2Page1);
    return Tab2Page1;
}());
exports.Tab2Page1 = Tab2Page1;
// @DeepLink({ name: 'tab2-page2' })
var Tab2Page2 = (function () {
    function Tab2Page2() {
        this.tab2Page3 = Tab2Page3;
    }
    Tab2Page2.prototype.ionViewWillEnter = function () {
        console.log('Tab2Page2, ionViewWillEnter');
    };
    Tab2Page2.prototype.ionViewDidEnter = function () {
        console.log('Tab2Page2, ionViewDidEnter');
    };
    Tab2Page2.prototype.ionViewWillLeave = function () {
        console.log('Tab2Page2, ionViewWillLeave');
    };
    Tab2Page2.prototype.ionViewDidLeave = function () {
        console.log('Tab2Page2, ionViewDidLeave');
    };
    Tab2Page2.prototype.ionViewWillUnload = function () {
        console.log('Tab2Page2, ionViewWillUnload');
    };
    Tab2Page2 = __decorate([
        core_1.Component({
            templateUrl: './tab2page2.html'
        }), 
        __metadata('design:paramtypes', [])
    ], Tab2Page2);
    return Tab2Page2;
}());
exports.Tab2Page2 = Tab2Page2;
// @DeepLink({
//   name: 'tab2-page3',
//   defaultHistory: []
// })
var Tab2Page3 = (function () {
    function Tab2Page3(navCtrl) {
        this.navCtrl = navCtrl;
    }
    Tab2Page3.prototype.ionViewCanLeave = function () {
        console.log('Tab2Page3, ionViewCanLeave', false);
        return false;
    };
    Tab2Page3.prototype.ionViewWillEnter = function () {
        console.log('Tab2Page3, ionViewWillEnter');
    };
    Tab2Page3.prototype.ionViewDidEnter = function () {
        console.log('Tab2Page3, ionViewDidEnter');
    };
    Tab2Page3.prototype.ionViewWillLeave = function () {
        console.log('Tab2Page3, ionViewWillLeave');
    };
    Tab2Page3.prototype.ionViewDidLeave = function () {
        console.log('Tab2Page3, ionViewDidLeave');
    };
    Tab2Page3.prototype.ionViewWillUnload = function () {
        console.log('Tab2Page3, ionViewWillUnload');
    };
    Tab2Page3 = __decorate([
        core_1.Component({
            templateUrl: './tab2page3.html'
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _a) || Object])
    ], Tab2Page3);
    return Tab2Page3;
    var _a;
}());
exports.Tab2Page3 = Tab2Page3;
//
// tab 3
//
// @DeepLink({ name: 'tab3-page1' })
var Tab3Page1 = (function () {
    function Tab3Page1() {
    }
    Tab3Page1.prototype.ionViewWillEnter = function () {
        console.log('Tab3Page1, ionViewWillEnter');
    };
    Tab3Page1.prototype.ionViewDidEnter = function () {
        console.log('Tab3Page1, ionViewDidEnter');
    };
    Tab3Page1.prototype.ionViewWillLeave = function () {
        console.log('Tab3Page1, ionViewWillLeave');
    };
    Tab3Page1.prototype.ionViewDidLeave = function () {
        console.log('Tab3Page1, ionViewDidLeave');
    };
    Tab3Page1.prototype.ionViewWillUnload = function () {
        console.log('Tab3Page1, ionViewWillUnload');
    };
    Tab3Page1 = __decorate([
        core_1.Component({
            templateUrl: './tab3page1.html'
        }), 
        __metadata('design:paramtypes', [])
    ], Tab3Page1);
    return Tab3Page1;
}());
exports.Tab3Page1 = Tab3Page1;
var E2EApp = (function () {
    function E2EApp() {
        this.rootPage = SignIn;
    }
    E2EApp = __decorate([
        core_1.Component({
            template: '<ion-nav [root]="rootPage" swipeBackEnabled="false"></ion-nav>'
        }), 
        __metadata('design:paramtypes', [])
    ], E2EApp);
    return E2EApp;
}());
exports.E2EApp = E2EApp;
exports.deepLinkConfig = {
    links: [
        { component: SignIn, name: 'sign-in' },
        { component: TabsPage, name: 'tabs' },
        { component: Tab1Page1, name: 'tab1-page1' },
        { component: Tab1Page2, name: 'tab1-page2' },
        { component: Tab1Page3, name: 'tab1-page3' },
        { component: Tab2Page1, name: 'tab2-page1' },
        { component: Tab2Page2, name: 'tab2-page2' },
        { component: Tab2Page3, name: 'tab2-page3' },
        { component: Tab3Page1, name: 'tab3-page1' },
    ]
};
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                E2EApp,
                SignIn,
                ChatPage,
                TabsPage,
                Tab1Page1,
                Tab1Page2,
                Tab1Page3,
                Tab2Page1,
                Tab2Page2,
                Tab2Page3,
                Tab3Page1
            ],
            imports: [
                ionic_angular_1.IonicModule.forRoot(E2EApp, { tabsHideOnSubPages: true }, exports.deepLinkConfig)
            ],
            bootstrap: [ionic_angular_1.IonicApp],
            entryComponents: [
                SignIn,
                ChatPage,
                TabsPage,
                Tab1Page1,
                Tab1Page2,
                Tab1Page3,
                Tab2Page1,
                Tab2Page2,
                Tab2Page3,
                Tab3Page1
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;