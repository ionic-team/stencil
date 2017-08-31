var fs = require('fs');
var path = require('path');
var http = require('http');
var Url = require('url');
var nodeFetch = require('node-fetch');


function patchFetchXhr(ctx, wwwDir, window) {
  patchFetch(ctx, wwwDir, window);
}


function patchFetch(ctx, wwwDir, window) {

  function fetch(input, init) {
    createServer(ctx, wwwDir);

    if (typeof input === 'string') {
      // fetch(url)
      return nodeFetch(normalizeUrl(window, input), init);

    } else {
      // fetch(Request)
      input.url = normalizeUrl(window, input.url);
      return nodeFetch(input, init);
    }
  }

  window.fetch = fetch;
}


function normalizeUrl(window, url) {
  var parsedUrl = Url.parse(url);

  if (!parsedUrl.protocol || !parsedUrl.hostname) {
    parsedUrl.protocol = 'http:';
    parsedUrl.host = 'localhost:' + PORT;
    url = Url.format(parsedUrl);
  }

  return url;
}


function createServer(ctx, wwwDir) {
  if (ctx.localPrerenderServer) return;

  ctx.localPrerenderServer = http.createServer((request, response) => {
    var parsedUrl = Url.parse(request.url);
    var filePath = path.join(wwwDir, parsedUrl.pathname);

    fs.readFile(filePath, 'utf-8', function(err, data) {
      if (err) {
        response.write('Error fetching: ' + parsedUrl.pathname + ' : ' + err);
      } else {
        response.write(data);
      }
      response.end();
    });

  });

  ctx.localPrerenderServer.listen(PORT);
}

var PORT = 53536;

exports.patchFetchXhr = patchFetchXhr;
