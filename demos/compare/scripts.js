
var compareIndexes = Object.keys(compareData)
var rootEle = document.createElement('div');

var search = window.location.search.replace('?', '');

for (var i = 0; i < compareIndexes.length; i++) {
  if (ionic2Data[compareIndexes[i]]) {

    if (search) {
      if (compareIndexes[i].indexOf(search) === -1) {
        continue;
      }
    }

    buildCompareRow(compareIndexes[i]);
  }
}

document.body.appendChild(rootEle);


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

  var header = document.createElement('header');
  header.textContent = src.replace('/index.html', '');
  wrapper.appendChild(header);

  var iframeEle = document.createElement('iframe');

  iframeEle.src = src;
  iframeEle.frameBorder = 0;

  wrapper.appendChild(iframeEle);
  return wrapper;
}
