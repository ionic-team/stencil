window.ionic=window.ionic||{};window.ionic.components={'ion-badge':[{ios:'8bc3e3bb',md:'80ccf7f0',wp:'581787f8'}]};
(function (window, document, requiresEs5) {
    'use strict';

    var tags = window.ionic && window.ionic.components && Object.keys(window.ionic.components);
    if (tags) {
        var styleElm = document.createElement('style');
        tags = tags.map(function (tag) {
            return tag + ':not([upgraded])';
        });
        styleElm.innerHTML = tags.join(',') + '{visibility:hidden;overflow:hidden}';
        document.head.appendChild(styleElm);
    }
    var staticDir;
    var scriptElm = document.getElementsByTagName('script');
    scriptElm = scriptElm[scriptElm.length - 1];
    var isMin = scriptElm.src.indexOf('.min.js') > -1;
    var stcDir = document.querySelector('script[data-static-dir]');
    if (stcDir) {
        staticDir = stcDir.dataset['staticDir'];
    } else {
        var paths = scriptElm.src.split('/');
        paths.pop();
        staticDir = scriptElm.dataset['staticDir'] = paths.join('/') + '/';
    }
    var pathItems = ['f9d3f011'];
    if (!window.customElements || requiresEs5()) {
        pathItems.push('es5');
    }
    if (isMin) {
        pathItems.push('min');
    }
    var s = document.createElement('script');
    s.src = staticDir + 'ionic.' + pathItems.join('.') + '.js';
    document.head.appendChild(s);
})(window, document, function es5() {
    try {
        eval('(class C{})');
    } catch (e) {
        return true;
    }
});