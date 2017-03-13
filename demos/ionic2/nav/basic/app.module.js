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
var MyCmpTest2 = (function () {
    function MyCmpTest2() {
        this.value = 'Test Failed';
    }
    MyCmpTest2 = __decorate([
        core_1.Component({
            selector: 'my-cmp2',
            template: "<span style=\"color:green\">{{value}}</span>"
        }), 
        __metadata('design:paramtypes', [])
    ], MyCmpTest2);
    return MyCmpTest2;
}());
exports.MyCmpTest2 = MyCmpTest2;
var MyCmpTest = (function () {
    function MyCmpTest() {
        this.value = 'Test Failed';
    }
    MyCmpTest.prototype.ngOnInit = function () {
        this.label = this._label;
    };
    __decorate([
        core_1.ViewChild(MyCmpTest2), 
        __metadata('design:type', MyCmpTest2)
    ], MyCmpTest.prototype, "_label", void 0);
    MyCmpTest = __decorate([
        core_1.Component({
            selector: 'my-cmp',
            template: "<my-cmp2></my-cmp2> <span style=\"color:green\">{{value}}</span>"
        }), 
        __metadata('design:paramtypes', [])
    ], MyCmpTest);
    return MyCmpTest;
}());
exports.MyCmpTest = MyCmpTest;
var FirstPage = (function () {
    function FirstPage(navCtrl, viewCtrl, alertCtrl) {
        this.navCtrl = navCtrl;
        this.viewCtrl = viewCtrl;
        this.alertCtrl = alertCtrl;
        this.pushPage = FullPage;
        this.firstPage = FirstPage;
        this.title = 'First Page';
        this.pages = [];
        this.canLeave = true;
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
    FirstPage.prototype.ionViewWillLoad = function () {
        console.log('ionViewWillLoad, FirstPage', this.viewCtrl.id);
        this.called.ionViewWillLoad++;
    };
    FirstPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad, FirstPage');
        for (var i = 1; i <= 50; i++) {
            this.pages.push(i);
        }
        if (!this.myCmp || !this.content || !this.myCmp.label) {
            throw new Error('children are not loaded');
        }
        this.myCmp.value = '👍 self test passed!';
        this.myCmp.label.value = '👍 children test passed!';
        this.called.ionViewDidLoad++;
    };
    FirstPage.prototype.ionViewWillEnter = function () {
        console.log('ionViewWillEnter, FirstPage', this.viewCtrl.id);
        this.called.ionViewWillEnter++;
    };
    FirstPage.prototype.ionViewDidEnter = function () {
        console.log('ionViewDidEnter, FirstPage', this.viewCtrl.id);
        this.called.ionViewDidEnter++;
    };
    FirstPage.prototype.ionViewWillLeave = function () {
        console.log('ionViewWillLeave, FirstPage', this.viewCtrl.id);
        this.called.ionViewWillLeave++;
    };
    FirstPage.prototype.ionViewDidLeave = function () {
        console.log('ionViewDidLeave, FirstPage', this.viewCtrl.id);
        this.called.ionViewDidLeave++;
    };
    FirstPage.prototype.ionViewWillUnload = function () {
        console.log('ionViewWillUnload, FirstPage', this.viewCtrl.id);
        this.called.ionViewWillUnload++;
    };
    FirstPage.prototype.ionViewCanLeave = function () {
        if (this.canLeave) {
            return true;
        }
        var alert = this.alertCtrl.create();
        alert.setMessage('You can check-out any time you like, but you can never leave.');
        alert.addButton({ text: 'Umm, ok', role: 'cancel', });
        alert.present();
        this.called.ionViewCanLeave++;
        return false;
    };
    FirstPage.prototype.ionViewCanEnter = function () {
        this.called.ionViewCanEnter++;
        return true;
    };
    FirstPage.prototype.setPages = function () {
        var items = [
            { page: PrimaryHeaderPage }
        ];
        this.navCtrl.setPages(items);
    };
    FirstPage.prototype.setRoot = function () {
        this.navCtrl.setRoot(PrimaryHeaderPage);
    };
    FirstPage.prototype.pushPrimaryHeaderPage = function () {
        this.navCtrl.push(PrimaryHeaderPage, null, {
            animate: true,
            animation: 'ios-transition'
        }).then(function () { }, function (rejectReason) {
        });
    };
    FirstPage.prototype.pushRedirect = function () {
        this.navCtrl.push(RedirectPage).then(function () { }, function (rejectReason) {
        });
    };
    FirstPage.prototype.pushFullPage = function () {
        this.navCtrl.push(FullPage, { id: 8675309, myData: [1, 2, 3, 4] }, {
            animate: true,
            animation: 'md-transition'
        }).catch(function () {
        });
    };
    FirstPage.prototype.pushAnother = function () {
        this.navCtrl.push(AnotherPage, null, {
            animate: true,
            animation: 'wp-transition'
        }).catch(function () {
        });
    };
    FirstPage.prototype.pushTabsPage = function () {
        this.navCtrl.push(TabsPage).catch(function () {
        });
    };
    FirstPage.prototype.quickPush = function () {
        var _this = this;
        this.navCtrl.push(AnotherPage).catch(function () {
        });
        setTimeout(function () {
            _this.navCtrl.push(PrimaryHeaderPage).catch(function () {
            });
        }, 150);
    };
    FirstPage.prototype.quickPop = function () {
        var _this = this;
        this.navCtrl.push(AnotherPage).catch(function () {
        });
        setTimeout(function () {
            _this.navCtrl.remove(1, 1).catch(function () {
            });
        }, 250);
    };
    FirstPage.prototype.pop = function () {
        this.navCtrl.pop().catch(function () { });
    };
    FirstPage.prototype.viewDismiss = function () {
        this.viewCtrl.dismiss();
    };
    FirstPage.prototype.reload = function () {
        window.location.reload();
    };
    FirstPage.prototype.scrollToTop = function () {
        this.content.scrollToTop();
    };
    FirstPage.prototype.scrollToBottom = function () {
        this.content.scrollToBottom(1000);
    };
    __decorate([
        core_1.ViewChild(ionic_angular_1.Content), 
        __metadata('design:type', (typeof (_a = typeof ionic_angular_1.Content !== 'undefined' && ionic_angular_1.Content) === 'function' && _a) || Object)
    ], FirstPage.prototype, "content", void 0);
    __decorate([
        core_1.ViewChild(MyCmpTest), 
        __metadata('design:type', MyCmpTest)
    ], FirstPage.prototype, "myCmp", void 0);
    FirstPage = __decorate([
        core_1.Component({
            template: "\n    <ion-header>\n      <ion-navbar>\n        <ion-title>{{title}}</ion-title>\n        <ion-buttons start>\n          <button ion-button icon-only><ion-icon name=\"star\"></ion-icon></button>\n        </ion-buttons>\n        <ion-buttons end>\n          <button ion-button>S1g</button>\n        </ion-buttons>\n      </ion-navbar>\n    </ion-header>\n    <ion-content>\n      <div padding>\n        <p>ionViewCanEnter ({{called.ionViewCanEnter}})</p>\n        <p>ionViewCanLeave ({{called.ionViewCanLeave}})</p>\n        <p>ionViewWillLoad ({{called.ionViewWillLoad}})</p>\n        <p>ionViewDidLoad ({{called.ionViewDidLoad}})</p>\n        <p>ionViewWillEnter ({{called.ionViewWillEnter}})</p>\n        <p>ionViewDidEnter ({{called.ionViewDidEnter}})</p>\n        <p>ionViewWillLeave ({{called.ionViewWillLeave}})</p>\n        <p>ionViewDidLeave ({{called.ionViewDidLeave}})</p>\n        <my-cmp></my-cmp>\n      </div>\n      <ion-list>\n        <ion-list-header>\n          {{title}}\n        </ion-list-header>\n        <ion-item class=\"e2eFrom1To2\" (click)=\"pushFullPage()\">Push to FullPage</ion-item>\n        <button ion-item (click)=\"pushPrimaryHeaderPage()\">Push to PrimaryHeaderPage</button>\n        <button ion-item (click)=\"pushRedirect()\">Push to Redirect</button>\n        <button ion-item (click)=\"pushTabsPage()\">Push to Tabs Page</button>\n        <button ion-item (click)=\"pushAnother()\">Push to AnotherPage</button>\n        <ion-item>\n          <ion-label>Text Input</ion-label>\n          <ion-textarea></ion-textarea>\n        </ion-item>\n        <button ion-item [navPush]=\"pushPage\">Push FullPage w/ [navPush]=\"pushPage\"</button>\n        <button ion-item [navPush]=\"pushPage\" [navParams]=\"{id:40}\">Push w/ [navPush] and [navParams]</button>\n        <button ion-item [navPush]=\"firstPage\">Push w/ [navPush] and firstPage</button>\n        <button ion-item (click)=\"setPages()\">setPages() (Go to PrimaryHeaderPage)</button>\n        <button ion-item (click)=\"setRoot()\">setRoot(PrimaryHeaderPage) (Go to PrimaryHeaderPage)</button>\n        <button ion-item (click)=\"pop()\">Pop</button>\n        <ion-item>\n          <ion-label>Toggle Can Leave</ion-label>\n          <ion-toggle (click)=\"canLeave = !canLeave\"></ion-toggle>\n        </ion-item>\n        <button ion-item (click)=\"viewDismiss()\">View Dismiss</button>\n        <button ion-item (click)=\"quickPush()\">New push during transition</button>\n        <button ion-item (click)=\"quickPop()\">New pop during transition</button>\n        <button ion-item (click)=\"reload()\">Reload</button>\n        <button ion-item (click)=\"scrollToBottom()\">Scroll to bottom</button>\n        <button ion-item *ngFor=\"let i of pages\" (click)=\"pushPrimaryHeaderPage()\">Page {{i}}</button>\n        <button ion-item (click)=\"content.scrollToTop()\">Scroll to top</button>\n      </ion-list>\n    </ion-content>"
        }), 
        __metadata('design:paramtypes', [(typeof (_b = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _b) || Object, (typeof (_c = typeof ionic_angular_1.ViewController !== 'undefined' && ionic_angular_1.ViewController) === 'function' && _c) || Object, (typeof (_d = typeof ionic_angular_1.AlertController !== 'undefined' && ionic_angular_1.AlertController) === 'function' && _d) || Object])
    ], FirstPage);
    return FirstPage;
    var _a, _b, _c, _d;
}());
exports.FirstPage = FirstPage;
var RedirectPage = (function () {
    function RedirectPage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    RedirectPage.prototype.ionViewDidEnter = function () {
        this.navCtrl.push(PrimaryHeaderPage);
    };
    RedirectPage = __decorate([
        core_1.Component({ template: '<ion-content></ion-content>' }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _a) || Object])
    ], RedirectPage);
    return RedirectPage;
    var _a;
}());
exports.RedirectPage = RedirectPage;
var FullPage = (function () {
    function FullPage(navCtrl, viewCtrl, app, alertCtrl, params) {
        this.navCtrl = navCtrl;
        this.viewCtrl = viewCtrl;
        this.app = app;
        this.alertCtrl = alertCtrl;
        this.params = params;
    }
    FullPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad, FullPage', this.viewCtrl.id);
    };
    FullPage.prototype.ionViewWillEnter = function () {
        console.log('ionViewWillEnter, FullPage', this.viewCtrl.id);
    };
    FullPage.prototype.ionViewDidEnter = function () {
        console.log('ionViewDidEnter, FullPage', this.viewCtrl.id);
    };
    FullPage.prototype.ionViewWillLeave = function () {
        console.log('ionViewWillLeave, FullPage', this.viewCtrl.id);
    };
    FullPage.prototype.ionViewDidLeave = function () {
        console.log('ionViewDidLeave, FullPage', this.viewCtrl.id);
    };
    FullPage.prototype.ionViewWillUnload = function () {
        console.log('ionViewWillUnload, FullPage', this.viewCtrl.id);
    };
    FullPage.prototype.setPages = function () {
        var items = [
            { page: FirstPage },
            { page: PrimaryHeaderPage }
        ];
        this.navCtrl.setPages(items);
    };
    FullPage.prototype.pushPrimaryHeaderPage = function () {
        this.navCtrl.push(PrimaryHeaderPage);
    };
    FullPage.prototype.pushAnother = function () {
        this.navCtrl.push(AnotherPage);
    };
    FullPage.prototype.pushFirstPage = function () {
        this.navCtrl.push(FirstPage);
    };
    FullPage.prototype.presentAlert = function () {
        var _this = this;
        var alert = this.alertCtrl.create();
        alert.setTitle('Hello Alert');
        alert.setMessage('Dismiss this alert, then pop one page');
        alert.addButton({
            text: 'Dismiss',
            role: 'cancel',
            handler: function () {
                // overlays are added and removed from the app root's portal
                // in the example below, alert.dismiss() dismisses the alert
                // from the app root portal, and once it's done transitioning out,
                // this the active page is popped from the nav
                alert.dismiss().then(function () {
                    _this.navCtrl.pop();
                });
                // by default an alert will dismiss itself
                // however, we don't want to use the default
                // but rather fire off our own pop navigation
                // return false so it doesn't pop automatically
                return false;
            }
        });
        alert.present();
    };
    FullPage = __decorate([
        core_1.Component({
            template: "\n    <ion-content padding>\n      <h1>Full page</h1>\n      <p>This page does not have a nav bar!</p>\n      <p><button ion-button (click)=\"navCtrl.pop()\">Pop</button></p>\n      <p><button ion-button class=\"e2eFrom2To3\" (click)=\"pushPrimaryHeaderPage()\">Push to PrimaryHeaderPage</button></p>\n      <p><button ion-button (click)=\"pushAnother()\">Push to AnotherPage</button></p>\n      <p><button ion-button (click)=\"pushFirstPage()\">Push to FirstPage</button></p>\n      <p><button ion-button class=\"e2eFrom2To1\" navPop>Pop with NavPop (Go back to 1st)</button></p>\n      <p><button ion-button (click)=\"setPages()\">setPages() (Go to PrimaryHeaderPage, FirstPage 1st in history)</button></p>\n      <p><button ion-button (click)=\"presentAlert()\">Present Alert</button></p>\n    </ion-content>\n  "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _a) || Object, (typeof (_b = typeof ionic_angular_1.ViewController !== 'undefined' && ionic_angular_1.ViewController) === 'function' && _b) || Object, (typeof (_c = typeof ionic_angular_1.App !== 'undefined' && ionic_angular_1.App) === 'function' && _c) || Object, (typeof (_d = typeof ionic_angular_1.AlertController !== 'undefined' && ionic_angular_1.AlertController) === 'function' && _d) || Object, (typeof (_e = typeof ionic_angular_1.NavParams !== 'undefined' && ionic_angular_1.NavParams) === 'function' && _e) || Object])
    ], FullPage);
    return FullPage;
    var _a, _b, _c, _d, _e;
}());
exports.FullPage = FullPage;
var PrimaryHeaderPage = (function () {
    function PrimaryHeaderPage(navCtrl, alertCtrl, viewCtrl) {
        this.navCtrl = navCtrl;
        this.alertCtrl = alertCtrl;
        this.viewCtrl = viewCtrl;
    }
    PrimaryHeaderPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad, PrimaryHeaderPage', this.viewCtrl.id);
    };
    PrimaryHeaderPage.prototype.ionViewWillEnter = function () {
        console.log('ionViewWillEnter, PrimaryHeaderPage', this.viewCtrl.id);
        this.viewCtrl.setBackButtonText('Previous');
        this.subheader = 'I\'m a sub header!';
    };
    PrimaryHeaderPage.prototype.ionViewDidEnter = function () {
        console.log('ionViewDidEnter, PrimaryHeaderPage', this.viewCtrl.id);
    };
    PrimaryHeaderPage.prototype.ionViewWillLeave = function () {
        console.log('ionViewWillLeave, PrimaryHeaderPage', this.viewCtrl.id);
    };
    PrimaryHeaderPage.prototype.ionViewDidLeave = function () {
        console.log('ionViewDidLeave, PrimaryHeaderPage', this.viewCtrl.id);
    };
    PrimaryHeaderPage.prototype.ionViewWillUnload = function () {
        console.log('ionViewWillUnload, PrimaryHeaderPage', this.viewCtrl.id);
    };
    PrimaryHeaderPage.prototype.pushAnother = function () {
        this.navCtrl.push(AnotherPage);
    };
    PrimaryHeaderPage.prototype.pushFullPage = function () {
        this.navCtrl.push(FullPage, { id: 8675309, myData: [1, 2, 3, 4] });
    };
    PrimaryHeaderPage.prototype.insert = function () {
        this.navCtrl.insert(2, FirstPage);
    };
    PrimaryHeaderPage.prototype.removeSecond = function () {
        this.navCtrl.remove(1);
    };
    PrimaryHeaderPage.prototype.setRoot = function () {
        this.navCtrl.setRoot(AnotherPage);
    };
    PrimaryHeaderPage.prototype.presentAlert = function () {
        var alert = this.alertCtrl.create();
        alert.setTitle('Hello Alert');
        alert.addButton({ text: 'Dismiss', role: 'cancel', });
        alert.present();
    };
    PrimaryHeaderPage = __decorate([
        core_1.Component({
            template: "\n    <ion-header>\n      <ion-navbar color=\"primary\">\n        <ion-title>Primary Color Page Header</ion-title>\n        <ion-buttons end>\n          <button ion-button>S1g</button>\n        </ion-buttons>\n      </ion-navbar>\n      <ion-toolbar>\n        <ion-title>{{subheader}}</ion-title>\n      </ion-toolbar>\n    </ion-header>\n    <ion-content padding fullscreen>\n      <p><button ion-button class=\"e2eFrom3To2\" (click)=\"navCtrl.pop()\">Pop</button></p>\n      <p><button ion-button (click)=\"pushAnother()\">Push to AnotherPage</button></p>\n      <p><button ion-button (click)=\"pushFullPage()\">Push to FullPage</button></p>\n      <p><button ion-button (click)=\"setRoot()\">setRoot(AnotherPage)</button></p>\n      <p><button ion-button (click)=\"navCtrl.popToRoot()\">Pop to root</button></p>\n      <p><button ion-button id=\"insert\" (click)=\"insert()\">Insert first page into history before this</button></p>\n      <p><button ion-button id=\"remove\" (click)=\"removeSecond()\">Remove second page in history</button></p>\n      <div class=\"yellow\"><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div></div>\n\n      <button ion-button ion-fixed no-margin color=\"danger\" (click)=\"presentAlert()\">fixed button (alert)</button>\n      <div ion-fixed style=\"position: absolute; pointer-events: none; top:0; bottom:0; right:0; width:50%; background: rgba(0,0,0,0.5);\"></div>\n    </ion-content>\n    <ion-footer>\n      <ion-toolbar>\n        I'm a sub footer!\n      </ion-toolbar>\n      <ion-toolbar>\n        <ion-title>Footer</ion-title>\n      </ion-toolbar>\n    </ion-footer>\n  "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _a) || Object, (typeof (_b = typeof ionic_angular_1.AlertController !== 'undefined' && ionic_angular_1.AlertController) === 'function' && _b) || Object, (typeof (_c = typeof ionic_angular_1.ViewController !== 'undefined' && ionic_angular_1.ViewController) === 'function' && _c) || Object])
    ], PrimaryHeaderPage);
    return PrimaryHeaderPage;
    var _a, _b, _c;
}());
exports.PrimaryHeaderPage = PrimaryHeaderPage;
var AnotherPage = (function () {
    function AnotherPage(navCtrl, viewCtrl) {
        this.navCtrl = navCtrl;
        this.viewCtrl = viewCtrl;
        this.bbHideToggleVal = false;
        this.bbCount = 0;
    }
    AnotherPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad, AnotherPage', this.viewCtrl.id);
    };
    AnotherPage.prototype.ionViewWillEnter = function () {
        console.log('ionViewWillEnter, AnotherPage', this.viewCtrl.id);
    };
    AnotherPage.prototype.ionViewDidEnter = function () {
        console.log('ionViewDidEnter, AnotherPage', this.viewCtrl.id);
    };
    AnotherPage.prototype.ionViewWillLeave = function () {
        console.log('ionViewWillLeave, AnotherPage', this.viewCtrl.id);
    };
    AnotherPage.prototype.ionViewDidLeave = function () {
        console.log('ionViewDidLeave, AnotherPage', this.viewCtrl.id);
    };
    AnotherPage.prototype.ionViewWillUnload = function () {
        console.log('ionViewWillUnload, AnotherPage', this.viewCtrl.id);
    };
    AnotherPage.prototype.pushFullPage = function () {
        this.navCtrl.push(FullPage);
    };
    AnotherPage.prototype.pushPrimaryHeaderPage = function () {
        this.navCtrl.push(PrimaryHeaderPage);
    };
    AnotherPage.prototype.pushFirstPage = function () {
        this.navCtrl.push(FirstPage);
    };
    AnotherPage.prototype.setRoot = function () {
        this.navCtrl.setRoot(FirstPage);
    };
    AnotherPage.prototype.toggleBackButton = function () {
        this.bbHideToggleVal = !this.bbHideToggleVal;
        this.viewCtrl.showBackButton(this.bbHideToggleVal);
    };
    AnotherPage.prototype.setBackButtonText = function () {
        var backButtonText = 'Messages';
        if (this.bbCount > 0) {
            backButtonText += " (" + this.bbCount + ")";
        }
        this.viewCtrl.setBackButtonText(backButtonText);
        ++this.bbCount;
    };
    AnotherPage = __decorate([
        core_1.Component({
            template: "\n    <ion-header>\n      <ion-navbar hideBackButton>\n        <ion-title>Another Page Header</ion-title>\n      </ion-navbar>\n    </ion-header>\n    <ion-content>\n      <ion-toolbar>\n        I'm a sub header in the content!\n      </ion-toolbar>\n      <ion-list>\n        <ion-item>\n          <ion-label>Text Input</ion-label>\n          <ion-textarea></ion-textarea>\n        </ion-item>\n        <ion-item>Back button hidden w/ <code>ion-navbar hideBackButton</code></ion-item>\n        <button ion-item (click)=\"navCtrl.pop()\">Pop</button>\n        <button ion-item (click)=\"pushFullPage()\">Push to FullPage</button>\n        <button ion-item (click)=\"pushPrimaryHeaderPage()\">Push to PrimaryHeaderPage</button>\n        <button ion-item (click)=\"pushFirstPage()\">Push to FirstPage</button>\n        <button ion-item (click)=\"setRoot()\">setRoot(FirstPage)</button>\n        <button ion-item (click)=\"toggleBackButton()\">Toggle hideBackButton</button>\n        <button ion-item (click)=\"setBackButtonText()\">Set Back Button Text</button>\n        <div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div>\n      </ion-list>\n      <ion-toolbar>\n        I'm a sub footer in the content!\n      </ion-toolbar>\n      <ion-toolbar>\n        And I'm a sub footer in the content too!\n      </ion-toolbar>\n    </ion-content>\n    <ion-footer>\n      <ion-toolbar>\n        Another Page Footer\n      </ion-toolbar>\n    </ion-footer>\n  "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _a) || Object, (typeof (_b = typeof ionic_angular_1.ViewController !== 'undefined' && ionic_angular_1.ViewController) === 'function' && _b) || Object])
    ], AnotherPage);
    return AnotherPage;
    var _a, _b;
}());
exports.AnotherPage = AnotherPage;
//
// Tab 1
//
var Tab1 = (function () {
    function Tab1(tabs, app, nav) {
        this.tabs = tabs;
        this.app = app;
        this.nav = nav;
        this.items = [];
        for (var i = 1; i <= 250; i++) {
            this.items.push(i);
        }
    }
    Tab1.prototype.goBack = function () {
        this.nav.parent.parent.pop();
    };
    Tab1.prototype.goTo = function () {
        this.nav.push(TabItemPage);
    };
    Tab1.prototype.selectPrevious = function () {
        this.tabs.select(this.tabs.previousTab());
    };
    Tab1.prototype.appNavPop = function () {
        this.app.navPop();
    };
    Tab1 = __decorate([
        core_1.Component({
            template: "\n    <ion-header>\n      <ion-navbar>\n        <ion-title>Heart</ion-title>\n      </ion-navbar>\n    </ion-header>\n\n    <ion-content>\n      <ion-list>\n        <ion-list-header>\n          Tab 1\n        </ion-list-header>\n        <ion-item>\n          <button ion-button (click)=\"goBack()\">Back</button>\n        </ion-item>\n        <ion-item (click)=\"goTo()\" *ngFor=\"let i of items\">Item {{i}} {{i}} {{i}} {{i}}</ion-item>\n      </ion-list>\n      <p>\n        <button ion-button (click)=\"selectPrevious()\">Select Previous Tab</button>\n      </p>\n      <p>\n        <button ion-button (click)=\"appNavPop()\">App Nav Pop</button>\n      </p>\n    </ion-content>\n    "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.Tabs !== 'undefined' && ionic_angular_1.Tabs) === 'function' && _a) || Object, (typeof (_b = typeof ionic_angular_1.App !== 'undefined' && ionic_angular_1.App) === 'function' && _b) || Object, (typeof (_c = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _c) || Object])
    ], Tab1);
    return Tab1;
    var _a, _b, _c;
}());
exports.Tab1 = Tab1;
//
// Tab 2
//
var Tab2 = (function () {
    function Tab2(tabs, app) {
        this.tabs = tabs;
        this.app = app;
        this.sessions = [];
        for (var i = 1; i <= 250; i++) {
            this.sessions.push({
                name: 'Name ' + i,
                location: 'Location: ' + i
            });
        }
    }
    Tab2.prototype.selectPrevious = function () {
        this.tabs.select(this.tabs.previousTab());
    };
    Tab2.prototype.appNavPop = function () {
        this.app.navPop();
    };
    Tab2 = __decorate([
        core_1.Component({
            template: "\n    <ion-header>\n      <ion-navbar>\n        <ion-title>Schedule</ion-title>\n      </ion-navbar>\n    </ion-header>\n\n    <ion-content>\n      <ion-list>\n        <ion-item-sliding *ngFor=\"let session of sessions\" #slidingItem>\n          <ion-item>\n            <h3>{{session.name}} {{session.name}} {{session.name}}</h3>\n            <p>{{session.location}} {{session.location}} {{session.location}}</p>\n          </ion-item>\n          <ion-item-options>\n            <button ion-button color=\"primary\">Speaker<br>Info</button>\n            <button ion-button color=\"secondary\">Add to<br>Favorites</button>\n          </ion-item-options>\n        </ion-item-sliding>\n      </ion-list>\n      <p>\n        <button ion-button (click)=\"selectPrevious()\">Select Previous Tab</button>\n      </p>\n      <p>\n        <button ion-button (click)=\"appNavPop()\">App Nav Pop</button>\n      </p>\n    </ion-content>\n  "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.Tabs !== 'undefined' && ionic_angular_1.Tabs) === 'function' && _a) || Object, (typeof (_b = typeof ionic_angular_1.App !== 'undefined' && ionic_angular_1.App) === 'function' && _b) || Object])
    ], Tab2);
    return Tab2;
    var _a, _b;
}());
exports.Tab2 = Tab2;
//
// Tab 3
//
var Tab3 = (function () {
    function Tab3(alertCtrl, modalCtrl, tabs, app) {
        this.alertCtrl = alertCtrl;
        this.modalCtrl = modalCtrl;
        this.tabs = tabs;
        this.app = app;
    }
    Tab3.prototype.presentAlert = function () {
        var alert = this.alertCtrl.create({
            title: 'Alert Title!',
            buttons: ['Dismiss']
        });
        alert.present();
    };
    Tab3.prototype.presentModal = function () {
        // this.modalCtrl.create(MyModal).present();
    };
    Tab3.prototype.selectPrevious = function () {
        this.tabs.select(this.tabs.previousTab());
    };
    Tab3.prototype.appNavPop = function () {
        this.app.navPop();
    };
    Tab3 = __decorate([
        core_1.Component({
            template: "\n    <ion-header>\n      <ion-navbar>\n        <button ion-button menuToggle>\n          <ion-icon name=\"menu\"></ion-icon>\n        </button>\n        <ion-title>Stopwatch</ion-title>\n      </ion-navbar>\n    </ion-header>\n\n    <ion-content padding>\n      <h2>Tab 3</h2>\n      <p>\n        <button ion-button (click)=\"presentAlert()\">Present Alert</button>\n        <button ion-button (click)=\"presentModal()\">Present Modal</button>\n      </p>\n      <p>\n        <button ion-button (click)=\"selectPrevious()\">Select Previous Tab</button>\n      </p>\n      <p>\n        <button ion-button (click)=\"appNavPop()\">App Nav Pop</button>\n      </p>\n    </ion-content>\n    "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.AlertController !== 'undefined' && ionic_angular_1.AlertController) === 'function' && _a) || Object, (typeof (_b = typeof ionic_angular_1.ModalController !== 'undefined' && ionic_angular_1.ModalController) === 'function' && _b) || Object, (typeof (_c = typeof ionic_angular_1.Tabs !== 'undefined' && ionic_angular_1.Tabs) === 'function' && _c) || Object, (typeof (_d = typeof ionic_angular_1.App !== 'undefined' && ionic_angular_1.App) === 'function' && _d) || Object])
    ], Tab3);
    return Tab3;
    var _a, _b, _c, _d;
}());
exports.Tab3 = Tab3;
var TabsPage = (function () {
    function TabsPage() {
        this.root1 = Tab1;
        this.root2 = Tab2;
        this.root3 = Tab3;
    }
    TabsPage.prototype.onChange = function (ev) {
        console.log('Changed tab', ev);
    };
    TabsPage.prototype.onSelect = function (ev) {
        console.log('Selected tab', ev);
    };
    TabsPage = __decorate([
        core_1.Component({
            template: "\n    <ion-menu [content]=\"content\">\n      <ion-header>\n        <ion-toolbar color=\"secondary\">\n          <ion-title>Menu</ion-title>\n        </ion-toolbar>\n      </ion-header>\n      <ion-content>\n        <ion-list>\n          <button ion-item menuClose detail-none>\n            Close Menu\n          </button>\n        </ion-list>\n      </ion-content>\n    </ion-menu>\n\n    <ion-tabs #content (ionChange)=\"onChange($event)\">\n      <ion-tab tabUrlPath=\"plain\" tabTitle=\"Plain List\" tabIcon=\"star\" [root]=\"root1\" (ionSelect)=\"onSelect($event)\"></ion-tab>\n      <ion-tab tabTitle=\"Schedule\" tabIcon=\"globe\" [root]=\"root2\"></ion-tab>\n      <ion-tab tabTitle=\"Stopwatch\" tabIcon=\"logo-facebook\" [root]=\"root3\"></ion-tab>\n      <ion-tab tabTitle=\"Messages\" tabIcon=\"chatboxes\" [root]=\"root1\"></ion-tab>\n      <ion-tab tabTitle=\"My Profile\" tabIcon=\"person\" [root]=\"root2\"></ion-tab>\n    </ion-tabs>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], TabsPage);
    return TabsPage;
}());
exports.TabsPage = TabsPage;
var TabItemPage = (function () {
    function TabItemPage(tabs, app) {
        this.tabs = tabs;
        this.app = app;
        this.items = [];
    }
    TabItemPage = __decorate([
        core_1.Component({
            template: "\n    <ion-header>\n      <ion-navbar>\n        <ion-title>Tab Item</ion-title>\n      </ion-navbar>\n    </ion-header>\n\n    <ion-content>\n      <h2>Hello moto</h2>\n    </ion-content>\n    "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.Tabs !== 'undefined' && ionic_angular_1.Tabs) === 'function' && _a) || Object, (typeof (_b = typeof ionic_angular_1.App !== 'undefined' && ionic_angular_1.App) === 'function' && _b) || Object])
    ], TabItemPage);
    return TabItemPage;
    var _a, _b;
}());
exports.TabItemPage = TabItemPage;
var E2EApp = (function () {
    function E2EApp() {
        this.root = FirstPage;
    }
    E2EApp = __decorate([
        core_1.Component({
            template: "<ion-nav [root]=\"root\"></ion-nav>"
        }), 
        __metadata('design:paramtypes', [])
    ], E2EApp);
    return E2EApp;
}());
exports.E2EApp = E2EApp;
exports.deepLinkConfig = {
    links: [
        { component: FirstPage, name: 'first-page' },
        { component: AnotherPage, name: 'another-page' },
        { component: MyCmpTest, name: 'tab1-page1' },
        { component: FullPage, name: 'full-page', defaultHistory: ['first-page', 'another-page'] },
        { component: PrimaryHeaderPage, name: 'primary-header-page', defaultHistory: ['first-page', 'full-page'] },
        { component: ionic_angular_1.Tabs, name: 'tabs' },
        { component: Tab1, name: 'tab1' },
        { component: TabItemPage, name: 'item' }
    ]
};
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                E2EApp,
                FirstPage,
                RedirectPage,
                AnotherPage,
                MyCmpTest,
                MyCmpTest2,
                FullPage,
                PrimaryHeaderPage,
                TabsPage,
                Tab1,
                Tab2,
                Tab3,
                TabItemPage
            ],
            imports: [
                ionic_angular_1.IonicModule.forRoot(E2EApp, {
                    swipeBackEnabled: true
                }, exports.deepLinkConfig)
            ],
            bootstrap: [ionic_angular_1.IonicApp],
            entryComponents: [
                E2EApp,
                FirstPage,
                RedirectPage,
                AnotherPage,
                FullPage,
                PrimaryHeaderPage,
                TabsPage,
                Tab1,
                Tab2,
                Tab3,
                TabItemPage
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;