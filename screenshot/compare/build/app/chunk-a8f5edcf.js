/*! Built with http://stenciljs.com */
const { h } = window.App;

function getFilterData() {
    const filterData = {};
    const hash = location.hash.replace('#', '');
    if (hash !== '') {
        const splt = hash.split(';');
        splt.forEach(part => {
            const s = part.split('-');
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
    const existingData = getFilterData();
    const hashData = Object.assign(existingData, updatedHashData);
    const keys = Object.keys(hashData);
    const newData = keys.map(key => {
        const d = hashData[key];
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
    const filterData = getFilterData();
    if (filterData.diff) {
        const diffElm = document.getElementById('d-' + filterData.diff);
        if (diffElm) {
            document.querySelector('.scroll-view').scrollTop = diffElm.offsetTop;
        }
    }
    const rows = document.querySelectorAll('compare-row');
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        row.hidden = false;
        if (!filterData.mismatch && row.diff.mismatchedPixels === 0) {
            row.hidden = true;
        }
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
window.onhashchange = () => {
    runFilters();
};

function getMismatchedPixels(imageA, imageB) {
    const cacheKey = getCacheKey(imageA, imageB);
    const mismatchedPixels = localStorage.getItem(cacheKey);
    if (typeof mismatchedPixels === 'string') {
        const num = parseInt(mismatchedPixels, 10);
        if (!isNaN(num)) {
            return num;
        }
    }
    return null;
}
function setMismatchedPixels(imageA, imageB, mismatchedPixels) {
    const cacheKey = getCacheKey(imageA, imageB);
    localStorage.setItem(cacheKey, String(mismatchedPixels));
}
function getCacheKey(imageA, imageB) {
    return `screenshot_mismatch_${imageA}_${imageB}`;
}

export { updateHash as a, setMismatchedPixels as b, runFilters as c, getMismatchedPixels as d };
