/*! Built with http://stenciljs.com */
App.loadBundle('chunk-58d1b5e0.js', ['exports'], function (exports) {
    var h = window.App.h;
    function getFilterData() {
        var filterData = {};
        var hash = location.hash.replace('#', '');
        if (hash !== '') {
            var splt = hash.split(';');
            splt.forEach(function (part) {
                var s = part.split('-');
                if (s.length > 1) {
                    filterData[s[0]] = s[1];
                }
                else {
                    filterData[s[0]] = true;
                }
            });
        }
        return filterData;
    }
    function updateHash(updatedHashData) {
        var existingData = getFilterData();
        var hashData = Object.assign(existingData, updatedHashData);
        var keys = Object.keys(hashData);
        var newData = keys.map(function (key) {
            var d = hashData[key];
            if (d === true) {
                return key;
            }
            else {
                return key + '-' + d;
            }
        });
        window.location.hash = newData.sort().join(';');
    }
    function runFilters() {
        var filterData = getFilterData();
        if (filterData.diff) {
            var diffElm = document.getElementById('d-' + filterData.diff);
            if (diffElm) {
                document.querySelector('.scroll-view').scrollTop = diffElm.offsetTop;
            }
        }
        var rows = document.querySelectorAll('compare-row');
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            row.hidden = false;
            // if (!filterData.mismatch && row.mismatchedPixels === 0) {
            //   row.hidden = true;
            // }
            // if (!filterData.comparable && !row.isComparable) {
            //   row.hidden = true;
            // }
            // if (filterData.device && filterData.device !== row.device) {
            //   row.hidden = true;
            // }
            if (!row.hidden) {
                row.runCompare();
            }
        }
    }
    window.onhashchange = function () {
        runFilters();
    };
    function getMismatchedPixels(imageA, imageB) {
        var cacheKey = getCacheKey(imageA, imageB);
        var mismatchedPixels = localStorage.getItem(cacheKey);
        if (typeof mismatchedPixels === 'string') {
            var num = parseInt(mismatchedPixels, 10);
            if (!isNaN(num)) {
                return num;
            }
        }
        return null;
    }
    function setMismatchedPixels(imageA, imageB, mismatchedPixels) {
        var cacheKey = getCacheKey(imageA, imageB);
        localStorage.setItem(cacheKey, String(mismatchedPixels));
    }
    function getCacheKey(imageA, imageB) {
        return "screenshot_mismatch_" + imageA + "_" + imageB;
    }
    exports.updateHash = updateHash;
    exports.setMismatchedPixels = setMismatchedPixels;
    exports.runFilters = runFilters;
    exports.getMismatchedPixels = getMismatchedPixels;
});
