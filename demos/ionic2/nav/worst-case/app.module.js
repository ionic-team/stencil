"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
var platform_browser_1 = require('@angular/platform-browser');
var LOG = '';
function log(page, message, color) {
    console.log(page + ": " + message);
    LOG += page + ":<span style=\"background:" + color + ";\">" + message + "</span>";
    LOG += '\n';
}
var TEMPLATE = "\n  <ion-header>\n    <ion-navbar>\n      <ion-title>{{_name}}</ion-title>\n    </ion-navbar>\n  </ion-header>\n\n  <ion-content text-center>\n    <p>This is the {{_name}}</p>\n    <div f></div>\n    <div f></div>\n  </ion-content>\n  ";
var Base = (function () {
    function Base(_name) {
        this._name = _name;
    }
    Base.prototype.ionViewWillLoad = function () {
        log(this._name, 'willLoad', 'green');
    };
    Base.prototype.ionViewDidLoad = function () {
        log(this._name, 'didLoad', 'green');
    };
    Base.prototype.ionViewWillEnter = function () {
        log(this._name, 'willEnter', 'greenyellow');
    };
    Base.prototype.ionViewDidEnter = function () {
        log(this._name, 'didEnter', 'cyan');
    };
    Base.prototype.ionViewWillLeave = function () {
        log(this._name, 'willLeave', 'greenyellow');
    };
    Base.prototype.ionViewDidLeave = function () {
        log(this._name, 'didLeave', 'cyan');
    };
    Base.prototype.ionViewWillUnload = function () {
        log(this._name, 'willUnload', 'lightgray');
    };
    Base.prototype.ionViewCanLeave = function () {
        log(this._name, 'canLeave', 'deeppink');
        return true;
    };
    Base.prototype.ionViewCanEnter = function () {
        log(this._name, 'canEnter', '#ff78c1');
        return true;
    };
    return Base;
}());
exports.Base = Base;
var Page1 = (function (_super) {
    __extends(Page1, _super);
    function Page1(nav) {
        _super.call(this, 'Page1');
        this.nav = nav;
    }
    Page1 = __decorate([
        core_1.Component({
            template: TEMPLATE
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _a) || Object])
    ], Page1);
    return Page1;
    var _a;
}(Base));
exports.Page1 = Page1;
var Page2 = (function (_super) {
    __extends(Page2, _super);
    function Page2(nav) {
        _super.call(this, 'Page2');
        this.nav = nav;
        this.counter = 4;
    }
    Page2.prototype.ionViewWillEnter = function () {
        _super.prototype.ionViewWillEnter.call(this);
        if (this.counter > 0) {
            this.nav.push(Page3, { animated: (this.counter !== 2) });
        }
        else if (this.counter === 0) {
            this.nav.push(Page4, { animate: false });
        }
        else {
            throw new Error('should not be here!');
        }
        this.counter--;
    };
    Page2 = __decorate([
        core_1.Component({
            template: TEMPLATE
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _a) || Object])
    ], Page2);
    return Page2;
    var _a;
}(Base));
exports.Page2 = Page2;
var Page3 = (function (_super) {
    __extends(Page3, _super);
    function Page3(nav, params) {
        _super.call(this, 'Page3');
        this.nav = nav;
        this.animated = params.get('animated');
    }
    Page3.prototype.ionViewDidEnter = function () {
        _super.prototype.ionViewDidEnter.call(this);
        this.nav.pop({ animate: this.animated });
    };
    Page3 = __decorate([
        core_1.Component({
            template: TEMPLATE
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _a) || Object, (typeof (_b = typeof ionic_angular_1.NavParams !== 'undefined' && ionic_angular_1.NavParams) === 'function' && _b) || Object])
    ], Page3);
    return Page3;
    var _a, _b;
}(Base));
exports.Page3 = Page3;
var Page4 = (function (_super) {
    __extends(Page4, _super);
    function Page4(nav) {
        _super.call(this, 'Page4');
        this.nav = nav;
    }
    Page4.prototype.doSomethingSync = function () {
        // this is a long running synchronous task
        // (imagine that a huge data must be transformed here recuresively or something similar)
        console.log('START DOING SOMETHING');
        console.time('DO SOMETHING EXPENSIVE SYNCHRONOUSLY');
        var e = 0;
        for (var i = 0; i < 8000000; i++) {
            e += Math.sqrt(i) / Math.log(i) / Math.cos(i);
        }
        console.timeEnd('DO SOMETHING EXPENSIVE SYNCHRONOUSLY');
        return e;
    };
    Page4.prototype.ngOnInit = function () {
        var _this = this;
        this.doSomethingSync();
        // once it has finished trigger another asynchronously
        setTimeout(function () {
            _this.doSomethingSync();
            setTimeout(function () {
                _this.nav.push(Page5).catch(function () {
                    _this.nav.push(Page6, { continue: false });
                    setTimeout(function () { return _this.nav.push(Page6, { continue: true }); }, 510);
                });
            }, 2000);
        }, 0);
    };
    Page4 = __decorate([
        core_1.Component({
            template: TEMPLATE
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _a) || Object])
    ], Page4);
    return Page4;
    var _a;
}(Base));
exports.Page4 = Page4;
var Page5 = (function (_super) {
    __extends(Page5, _super);
    function Page5(nav) {
        _super.call(this, 'Page5');
        this.nav = nav;
    }
    Page5.prototype.ionViewCanEnter = function () {
        _super.prototype.ionViewCanEnter.call(this);
        return new Promise(function (resolve) {
            setTimeout(function () { return resolve(false); }, 8000);
        });
    };
    Page5 = __decorate([
        core_1.Component({
            template: TEMPLATE
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _a) || Object])
    ], Page5);
    return Page5;
    var _a;
}(Base));
exports.Page5 = Page5;
var Page6 = (function (_super) {
    __extends(Page6, _super);
    function Page6(nav, params) {
        _super.call(this, 'Page6');
        this.nav = nav;
        this.continue = false;
        this.counter = 3;
        this.counterLeave = 3;
        this.continue = params.get('continue');
        console.log(this.continue);
    }
    Page6.prototype.ionViewCanLeave = function () {
        _super.prototype.ionViewCanLeave.call(this);
        if (this.continue === true) {
            this.counter--;
            if (this.counter > 0) {
                return false;
            }
            else if (this.counter === 0) {
                return true;
            }
            else {
                throw new Error('invalid');
            }
        }
        return true;
    };
    Page6.prototype.ionViewDidEnter = function () {
        var _this = this;
        if (this.continue === true) {
            setTimeout(function () { return _this.pop(); }, 2000 + 3000);
        }
    };
    Page6.prototype.ionViewWillLeave = function () {
        _super.prototype.ionViewWillLeave.call(this);
        this.pushPage7();
    };
    Page6.prototype.ionViewWillUnload = function () {
        _super.prototype.ionViewWillUnload.call(this);
        this.pushPage7();
    };
    Page6.prototype.pop = function () {
        var _this = this;
        this.nav.pop().then(function () {
            _this.pushPage7();
        }).catch(function () {
            _this.pop();
        });
    };
    Page6.prototype.pushPage7 = function () {
        if (this.continue) {
            this.counterLeave--;
            if (this.counterLeave === 0) {
                this.nav.push(Page7);
            }
            else if (this.counterLeave < 0) {
                throw new Error('invalid');
            }
        }
    };
    Page6 = __decorate([
        core_1.Component({
            template: TEMPLATE
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _a) || Object, (typeof (_b = typeof ionic_angular_1.NavParams !== 'undefined' && ionic_angular_1.NavParams) === 'function' && _b) || Object])
    ], Page6);
    return Page6;
    var _a, _b;
}(Base));
exports.Page6 = Page6;
var Page7 = (function (_super) {
    __extends(Page7, _super);
    function Page7(nav) {
        _super.call(this, 'Page7');
        this.nav = nav;
    }
    Page7.prototype.ionViewCanEnter = function () {
        var _this = this;
        _super.prototype.ionViewCanEnter.call(this);
        this.nav.setRoot(Page8);
        this.nav.setRoot(Page8, { animate: false });
        this.nav.setRoot(Page8).then(function () {
            _this.nav.setRoot(Results);
        });
        this.nav.push(Page8);
        this.nav.push(Page8);
        setTimeout(function () {
            _this.nav.pop({ animate: false });
        }, Math.random() * 100);
        setTimeout(function () {
            _this.nav.pop();
        }, Math.random() * 100);
        return true;
    };
    Page7 = __decorate([
        core_1.Component({
            template: TEMPLATE
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _a) || Object])
    ], Page7);
    return Page7;
    var _a;
}(Base));
exports.Page7 = Page7;
var Page8 = (function (_super) {
    __extends(Page8, _super);
    function Page8(nav) {
        _super.call(this, 'Page8');
        this.nav = nav;
    }
    Page8 = __decorate([
        core_1.Component({
            template: TEMPLATE
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _a) || Object])
    ], Page8);
    return Page8;
    var _a;
}(Base));
exports.Page8 = Page8;
var Results = (function () {
    function Results(nav, sanitizer) {
        this.nav = nav;
        this.sanitizer = sanitizer;
    }
    Results.prototype.ionViewDidEnter = function () {
        this.result = this.sanitizer.bypassSecurityTrustHtml(LOG);
    };
    Results = __decorate([
        core_1.Component({
            template: "\n  <ion-header>\n    <ion-navbar>\n      <ion-title>Results</ion-title>\n    </ion-navbar>\n  </ion-header>\n  <ion-content padding>\n    <pre style=\"font-size: 0.72em; column-count: 3;\" [innerHTML]=\"result\"></pre>\n  </ion-content>\n"
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ionic_angular_1.NavController !== 'undefined' && ionic_angular_1.NavController) === 'function' && _a) || Object, (typeof (_b = typeof platform_browser_1.DomSanitizer !== 'undefined' && platform_browser_1.DomSanitizer) === 'function' && _b) || Object])
    ], Results);
    return Results;
    var _a, _b;
}());
exports.Results = Results;
var E2EApp = (function () {
    function E2EApp() {
        var _this = this;
        this.root = Page1;
        setTimeout(function () { return _this.root = Page2; }, 100);
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
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                E2EApp,
                Page1,
                Page2,
                Page3,
                Page4,
                Page5,
                Page6,
                Page7,
                Page8,
                Results
            ],
            imports: [
                ionic_angular_1.IonicModule.forRoot(E2EApp)
            ],
            bootstrap: [ionic_angular_1.IonicApp],
            entryComponents: [
                E2EApp,
                Page1,
                Page2,
                Page3,
                Page4,
                Page5,
                Page6,
                Page7,
                Page8,
                Results
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;