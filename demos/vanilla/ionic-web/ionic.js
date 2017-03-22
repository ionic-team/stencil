(function (d) {
    'use strict';

    function staticDir() {
        var val = d.querySelector('script[data-static-dir]');
        if (val) {
            return val.dataset['staticDir'];
        }
        val = d.getElementsByTagName('script');
        val = val[val.length - 1];
        var paths = val.src.split('/');
        paths.pop();
        return val.dataset['staticDir'] = paths.join('/') + '/';
    }
    function es5() {
        try {
            eval('(class C{})');
        } catch (e) {
            return true;
        }
    }
    var i = ['components'];
    if (!window.customElements || es5()) {
        i.push('es5');
    }
    var s = d.createElement('script');
    s.src = staticDir() + 'ionic.' + i.join('.') + '.js';
    d.head.appendChild(s);
})(document);