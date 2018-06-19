const fs = require('fs');
const http = require('http');
const stencil = require('../../server/index.js');

// load the config
const config = stencil.loadConfig(__dirname);

// ensure ssr flag is set on the config
config.flags = { ssr: true };

// create the renderer
const renderer = new stencil.Renderer(config);

// load the source index.html
const srcIndexHtml = fs.readFileSync(config.srcIndexHtml, 'utf8');

// create a request handler
// this is an overly simplified example
// in a real-world server there would be route handlers
function requestHandler(req, res) {
  // hydrate!!
  renderer.hydrate({
    html: srcIndexHtml,
    req: req
  }).then(results => {

    // console log any diagnostics
    results.diagnostics.forEach(d => {
      console.log(d.messageText);
    });

    // respond with the hydrated html
    res.end(results.html);
  });
}

// create the server
const server = http.createServer(requestHandler);

// set which port the server will be listening on
const port = 3030;

// start listening and handling requests
server.listen(port, () => console.log(`server-side rendering listening on port: ${ port }`));
