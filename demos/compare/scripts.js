
var headerEle = document.querySelector('header');
var compareIndexes = Object.keys(compareData);
var rootEle = document.createElement('div');
rootEle.className = 'compare';
var selectEle = document.createElement('select');

var search = window.location.search.replace('?', '');
var splt = search.split('&');
search = splt[0];

var modeEle = document.querySelector('#mode');
modeEle.value = splt[1] || 'md';
modeEle.addEventListener('change', function(ev) {
  console.log('mode change', ev);
  window.location = '?' + search + '&' + ev.target.value;
});


var maxCompares = Math.min(10, compareIndexes.length);
var total = 0;
var selected;

var optionEle = document.createElement('option');
selectEle.appendChild(optionEle);

compareIndexes.forEach(compareIndex => {
  optionEle = document.createElement('option');
  optionEle.value = optionEle.text = compareIndex.replace('/index.html', '');
  selectEle.appendChild(optionEle);

  if (total < maxCompares && ionic2Data[compareIndex]) {

    if (search && compareIndex.indexOf(search) === -1) {
      return;
    }

    buildCompareRow(compareIndex);
    selected = optionEle.value;
    total++;
  }
});


headerEle.appendChild(selectEle);
document.body.appendChild(rootEle);

selectEle.addEventListener('change', function(ev) {
  console.log('select change', ev);
  window.location = '?' + ev.target.value;
});

if (total === 1) {
  selectEle.value = selected;
}


function buildCompareRow(compareIndex) {
  console.log(compareIndex);

  var rowEle = document.createElement('div');

  var ionic2IFrame = buildIframe('/demos/ionic2' + compareIndex);
  rowEle.appendChild(ionic2IFrame);

  var compareIFrame = buildIframe('/demos/web' + compareIndex);
  rowEle.appendChild(compareIFrame);

  rootEle.appendChild(rowEle);
}


function buildIframe(src) {
  var wrapper = document.createElement('div');
  wrapper.className = 'iframe-wrapper';

  var header = document.createElement('div');
  header.className = 'row-header';
  var headerAnchor = document.createElement('a');
  headerAnchor.href = src;
  headerAnchor.textContent = src.replace('/index.html', '');
  header.appendChild(headerAnchor);
  wrapper.appendChild(header);

  var iframeEle = document.createElement('iframe');

  iframeEle.src = src;
  iframeEle.frameBorder = 0;


  if (modeEle.value === 'wp') {
    headerAnchor.href += '?ionicplatform=windows';
    iframeEle.src += '?ionicplatform=windows';
  } else if (modeEle.value === 'ios') {
    headerAnchor.href += '?ionicplatform=ios';
    iframeEle.src += '?ionicplatform=ios';
  }

  wrapper.appendChild(iframeEle);
  return wrapper;
}
