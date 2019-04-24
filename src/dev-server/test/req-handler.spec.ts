import * as d from '@stencil/core/declarations';
import { createRequestHandler } from '../request-handler';
import { mockConfig } from '@stencil/core/testing';
import { normalizePath } from '@stencil/core/utils';
import { TestingFs } from '../../testing/testing-fs';
import { validateDevServer } from '../../compiler/config/validate-dev-server';
import nodeFs from 'fs';
import http from 'http';
import path from 'path';


describe('request-handler', () => {

  let config: d.DevServerConfig;
  let fs: TestingFs;
  let req: http.IncomingMessage;
  let res: TestServerResponse;
  const root = path.resolve('/');
  const tmplDirPath = normalizePath(path.join(__dirname, '..', 'templates', 'directory-index.html'));
  const tmplDir = nodeFs.readFileSync(tmplDirPath, 'utf8');
  const contentTypes = {
    'html': 'text/html',
    'css': 'text/css',
    'js': 'application/javascript',
    'svg': 'image/svg+xml'
  };

  beforeEach(async () => {
    fs = new TestingFs();

    const stencilConfig = mockConfig();
    stencilConfig.flags.serve = true;

    stencilConfig.devServer = {
      contentTypes: contentTypes,
      devServerDir: normalizePath(path.join(__dirname, '..')),
      root: normalizePath(path.join(root, 'www')),
      baseUrl: '/'
    };

    await fs.mkdir(stencilConfig.devServer.root);
    await fs.writeFile(path.join(stencilConfig.devServer.devServerDir, 'templates', 'directory-index.html'), tmplDir);

    config = validateDevServer(stencilConfig);
    req = {} as any;
    res = {} as any;

    res.writeHead = (statusCode: number, headers: any) => {
      res.$statusCode = statusCode;
      res.$headers = headers;
      res.$contentType = headers['Content-Type'];
    };

    res.write = (content: any) => {
      res.$contentWrite = content;
      return true;
    };

    res.end = () => {
      res.$content = res.$contentWrite;
    };
  });

  describe('historyApiFallback', () => {

    it('should load historyApiFallback index.html when dot in the url disableDotRule true', async () => {
      await fs.writeFile(path.join(root, 'www', 'index.html'), `root-index`);
      config.historyApiFallback = {
        index: 'index.html',
        disableDotRule: true
      };
      const handler = createRequestHandler(config, fs);

      req.headers = {
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
      };
      req.url = '/about.us';
      req.method = 'GET';

      await handler(req, res);
      expect(res.$statusCode).toBe(200);
    });

    it('should not load historyApiFallback index.html when dot in the url', async () => {
      await fs.writeFile(path.join(root, 'www', 'index.html'), `root-index`);
      config.historyApiFallback = {
        index: 'index.html'
      };
      const handler = createRequestHandler(config, fs);

      req.headers = {
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
      };
      req.url = '/about.us';
      req.method = 'GET';

      await handler(req, res);
      expect(res.$statusCode).toBe(404);
    });

    it('should not load historyApiFallback index.html when no text/html accept header', async () => {
      await fs.writeFile(path.join(root, 'www', 'index.html'), `root-index`);
      config.historyApiFallback = {
        index: 'index.html'
      };
      const handler = createRequestHandler(config, fs);

      req.headers = {
        accept: '*/*'
      };
      req.url = '/about-us';
      req.method = 'GET';

      await handler(req, res);
      expect(res.$statusCode).toBe(404);
    });

    it('should not load historyApiFallback index.html when not GET request', async () => {
      await fs.writeFile(path.join(root, 'www', 'index.html'), `root-index`);
      config.historyApiFallback = {
        index: 'index.html'
      };
      const handler = createRequestHandler(config, fs);

      req.headers = {
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
      };
      req.url = '/about-us';
      req.method = 'POST';

      await handler(req, res);
      expect(res.$statusCode).toBe(404);
    });

    it('should load historyApiFallback index.html when no trailing slash', async () => {
      await fs.writeFile(path.join(root, 'www', 'index.html'), `root-index`);
      config.historyApiFallback = {
        index: 'index.html'
      };
      const handler = createRequestHandler(config, fs);

      req.headers = {
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
      };
      req.url = '/about-us';

      await handler(req, res);
      expect(res.$statusCode).toBe(200);
      expect(res.$content).toContain('root-index');
      expect(res.$contentType).toBe('text/html');
    });

    it('should load historyApiFallback index.html when trailing slash', async () => {
      await fs.writeFile(path.join(root, 'www', 'index.html'), `root-index`);
      config.historyApiFallback = {
        index: 'index.html'
      };
      const handler = createRequestHandler(config, fs);

      req.headers = {
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
      };
      req.url = '/about-us/';

      await handler(req, res);
      expect(res.$statusCode).toBe(200);
      expect(res.$content).toContain('root-index');
      expect(res.$contentType).toBe('text/html');
    });

    it('should list directory when ended in slash and not using historyApiFallback', async () => {
      await fs.mkdir(path.join(root, 'www', 'about-us'));
      await fs.writeFile(path.join(root, 'www', 'about-us', 'somefile1.html'), `somefile1`);
      await fs.writeFile(path.join(root, 'www', 'about-us', 'somefile2.html'), `somefile2`);
      config.historyApiFallback = null;
      const handler = createRequestHandler(config, fs);

      req.headers = {
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
      };
      req.url = '/about-us/';

      await handler(req, res);
      expect(res.$statusCode).toBe(200);
      expect(res.$content).toContain('tmpl-dir');
      expect(res.$contentType).toBe('text/html');
    });

  });

  describe('serve directory index', () => {

    it('should load index.html in directory', async () => {
      await fs.mkdir(path.join(root, 'www', 'about-us'));
      await fs.writeFile(path.join(root, 'www', 'about-us.html'), `about-us.html page`);
      await fs.writeFile(path.join(root, 'www', 'about-us', 'index.html'), `about-us-index-directory`);
      config.historyApiFallback = null;
      const handler = createRequestHandler(config, fs);

      req.headers = {
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
      };
      req.url = '/about-us/';

      await handler(req, res);
      expect(res.$statusCode).toBe(200);
      expect(res.$content).toContain('about-us-index-directory');
      expect(res.$contentType).toBe('text/html');
    });

    it('should redirect directory w/ slash', async () => {
      await fs.mkdir(path.join(root, 'www', 'about-us'));
      await fs.writeFile(path.join(root, 'www', 'about-us', 'somefile1.html'), `somefile1`);
      await fs.writeFile(path.join(root, 'www', 'about-us', 'somefile2.html'), `somefile2`);
      config.historyApiFallback = {};
      const handler = createRequestHandler(config, fs);

      req.headers = {
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
      };
      req.url = '/about-us';

      await handler(req, res);
      expect(res.$statusCode).toBe(302);
      expect(res.$headers.location).toBe('/about-us/');
    });

    it('get directory index.html with no trailing slash', async () => {
      await fs.mkdir(path.join(root, 'www', 'about-us'));
      await fs.writeFile(path.join(root, 'www', 'about-us', 'index.html'), `aboutus`);
      const handler = createRequestHandler(config, fs);

      req.url = '/about-us';

      await handler(req, res);
      expect(res.$statusCode).toBe(200);
      expect(res.$content).toContain('aboutus');
      expect(res.$contentType).toBe('text/html');
    });

    it('get directory index.html with trailing slash and base url', async () => {
      config.baseUrl = '/my-base-url/';
      await fs.mkdir(path.join(root, 'www', 'about-us'));
      await fs.writeFile(path.join(root, 'www', 'about-us', 'index.html'), `aboutus`);
      const handler = createRequestHandler(config, fs);

      req.url = '/my-base-url/about-us/';

      await handler(req, res);
      expect(res.$statusCode).toBe(200);
      expect(res.$content).toContain('aboutus');
      expect(res.$contentType).toBe('text/html');
    });

    it('get directory index.html with trailing slash', async () => {
      await fs.mkdir(path.join(root, 'www', 'about-us'));
      await fs.writeFile(path.join(root, 'www', 'about-us', 'index.html'), `aboutus`);
      const handler = createRequestHandler(config, fs);

      req.url = '/about-us/';

      await handler(req, res);
      expect(res.$statusCode).toBe(200);
      expect(res.$content).toContain('aboutus');
      expect(res.$contentType).toBe('text/html');
    });

  });

  describe('error not found static files', () => {

    it('not find file', async () => {
      const handler = createRequestHandler(config, fs);

      req.url = '/www/index.html';

      await handler(req, res);
      expect(res.$statusCode).toBe(404);
      expect(res.$content).toContain('/index.html');
      expect(res.$contentType).toBe('text/plain');
    });

  });

  describe('root index', () => {

    it('serve directory listing when no index.html', async () => {
      await fs.writeFile(path.join(root, 'www', 'styles.css'), `/* hi */`);
      await fs.writeFile(path.join(root, 'www', 'scripts.js'), `// hi`);
      await fs.writeFile(path.join(root, 'www', '.gitignore'), `# gitignore`);
      const handler = createRequestHandler(config, fs);

      req.url = '/';

      await handler(req, res);
      expect(res.$statusCode).toBe(200);
      expect(res.$content).toContain('tmpl-dir');
      expect(res.$contentType).toBe('text/html');
    });

    it('serve root index.html w/ querystring', async () => {
      await fs.writeFile(path.join(root, 'www', 'index.html'), `hello`);
      config.gzip = false;
      const handler = createRequestHandler(config, fs);

      req.url = '/?qs=123';

      await handler(req, res);
      expect(res.$statusCode).toBe(200);
      expect(res.$content).toContain('hello');
      expect(res.$contentType).toBe('text/html');
    });

    it('serve root index.html w/ base url', async () => {
      config.baseUrl = '/my-base-url/';
      await fs.writeFile(path.join(root, 'www', 'index.html'), `hello`);
      const handler = createRequestHandler(config, fs);

      req.url = '/my-base-url/';

      await handler(req, res);
      expect(res.$statusCode).toBe(200);
      expect(res.$content).toContain('hello');
      expect(res.$contentType).toBe('text/html');
    });

    it('serve root index.html', async () => {
      await fs.writeFile(path.join(root, 'www', 'index.html'), `hello`);
      const handler = createRequestHandler(config, fs);

      req.url = '/';

      await handler(req, res);
      expect(res.$statusCode).toBe(200);
      expect(res.$content).toContain('hello');
      expect(res.$contentType).toBe('text/html');
    });

    it('302 redirect to / when no path at all', async () => {
      await fs.writeFile(path.join(root, 'www', 'index.html'), `hello`);
      const handler = createRequestHandler(config, fs);

      req.url = '';

      await handler(req, res);
      expect(res.$statusCode).toBe(302);
      expect(res.$headers.location).toBe('/');
    });

  });

  describe('serve static text files', () => {

    it('should load file w/ querystring', async () => {
      await fs.writeFile(path.join(root, 'www', 'scripts', 'file1.html'), `<html></html>`);
      const handler = createRequestHandler(config, fs);

      req.url = '/scripts/file1.html?qs=1234';

      await handler(req, res);
      expect(res.$statusCode).toBe(200);
      expect(res.$content).toContain('<html></html>');
      expect(res.$contentType).toBe('text/html');
    });

    it('should load html file', async () => {
      await fs.writeFile(path.join(root, 'www', 'scripts', 'file1.html'), `<html></html>`);
      const handler = createRequestHandler(config, fs);

      req.url = '/scripts/file1.html';

      await handler(req, res);
      expect(res.$statusCode).toBe(200);
      expect(res.$content).toContain('<html></html>');
      expect(res.$contentType).toBe('text/html');
    });

  });

});


interface TestServerResponse extends http.ServerResponse {
  $statusCode: number;
  $headers: any;
  $contentWrite: string;
  $content: string;
  $contentType: string;
}
