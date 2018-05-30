const path = require('path');
const cheerio = require('cheerio');
const express = require('express');
const http = require('http');
const fs = require('fs');
const request = require('supertest');
const stencil = require('../../server/index.js');


describe('test/server', () => {

  describe('express middleware', () => {

    it('multiple components w/ styles and multiple requests', done => {

      jest.resetModules();
      const app = express();

      // load the stencil config and
      // intialize serve-side rendering
      const { wwwDir, destroy } = stencil.initApp({
        app: app,
        configPath: path.join(__dirname, 'stencil.config.js')
      });

      server = app.listen(9030, () => {

        function testResponse(res) {
          const $ = cheerio.load(res.text);

          let elm = $('html[data-ssr]');
          expect(elm.length).toBe(1);

          expect($('h1').text().trim()).toBe('Stencil SSR Example');

          const css = $('style[data-styles]').html().trim();
          expect(css).toBe(`main{font-family:"Comic Sans MS";background:#000;padding:30px}h1{margin-top:0;color:red}p{color:#00f}span{color:green}`);
        }

        // first request
        request(app)
          .get('/')
          .expect(testResponse)
          .end(err => {
            if (err) throw err;

            // second request
            request(app)
              .get('/')
              .expect(testResponse)
              .end(err => {
                if (err) throw err;
                destroy();
                server.close(done);
              });
          });

      });

    });

  });


  describe('Node http server Render API', () => {

    it('multiple components w/ styles and multiple requests', done => {

      // load the config
      jest.resetModules();
      const config = stencil.loadConfig(__dirname);

      // ensure ssr flag is set on the config
      config.flags = { ssr: true };

      // create the renderer
      const renderer = new stencil.Renderer(config);

      // load the source index.html
      const srcIndexHtml = fs.readFileSync(config.srcIndexHtml, 'utf-8');

      // create a request handler
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

      const port = 9030;

      // start listening and handling requests
      server.listen(port, () => {

        function testResponse(text) {
          const $ = cheerio.load(text);

          let elm = $('html[data-ssr]');
          expect(elm.length).toBe(1);

          expect($('h1').text().trim()).toBe('Stencil SSR Example');

          const css = $('style[data-styles]').html().trim();
          expect(css).toBe(`main{font-family:"Comic Sans MS";background:#000;padding:30px}h1{margin-top:0;color:red}p{color:#00f}span{color:green}`);
        }

        http.get(`http://localhost:${port}/`, (res) => {
          res.setEncoding('utf8');
          let body = '';

          res.on('data', data => {
            body += data;
          });

          res.on('end', () => {
            testResponse(body);
            renderer.destroy();
            server.close(done);
          });

        });

      });

    });

  });

});
