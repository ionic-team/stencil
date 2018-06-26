import { createRequestHandler } from '../request-handler';
import { DevServerConfig } from '../../declarations';
import { mockConfig } from '../../testing/mocks';
import { normalizePath } from '../../compiler/util';
import { TestingFs } from '../../testing/testing-fs';
import { validateDevServer } from '../../compiler/config/validate-dev-server';
import * as nodeFs from 'fs';
import * as http from 'http';
import * as path from 'path';


describe('request-handler', async () => {

  let config: DevServerConfig;
  let fs: TestingFs;
  let req: http.ServerRequest;
  let res: TestServerResponse;
  const root = path.resolve('/');
  const tmplDirPath = normalizePath(path.join(__dirname, '..', 'templates', 'directory-index.html'));
  const tmpl404Path = normalizePath(path.join(__dirname, '..', 'templates', '404.html'));
  const tmplDir = nodeFs.readFileSync(tmplDirPath, 'utf8');
  const tmpl404 = nodeFs.readFileSync(tmpl404Path, 'utf8');
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
      root: normalizePath(path.join(root, 'www'))
    };

    await fs.mkdir(stencilConfig.devServer.root);
    await fs.writeFile(path.join(stencilConfig.devServer.devServerDir, 'templates', '404.html'), tmpl404);
    await fs.writeFile(path.join(stencilConfig.devServer.devServerDir, 'templates', 'directory-index.html'), tmplDir);

    config = validateDevServer(stencilConfig);
    req = {} as any;
    res = {} as any;

    res.writeHead = (statusCode, headers) => {
      res.$statusCode = statusCode;
      res.$headers = headers;
      res.$contentType = headers['Content-Type'];
    };

    res.write = (content) => {
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
        accept: '*/*'
      };
      req.url = '/about.us';
      req.method = 'GET';

      await handler(req, res);
      expect(res.$statusCode).toBe(404);
    });

    it('should not load historyApiFallback index.html when dot in the url', async () => {
      await fs.writeFile(path.join(root, 'www', 'index.html'), `root-index`);
      config.historyApiFallback = {
        index: 'index.html'
      };
      const handler = createRequestHandler(config, fs);

      req.headers = {
        accept: '*/*'
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

    it('not find js file', async () => {
      await fs.mkdir(path.join(root, 'www', 'scripts'));
      const handler = createRequestHandler(config, fs);

      req.url = '/scripts/file2.js';

      await handler(req, res);
      expect(res.$statusCode).toBe(404);
      expect(res.$content).toContain('/scripts/file2.js');
      expect(res.$contentType).toBe('text/plain');
    });

    it('not find css file', async () => {
      await fs.mkdir(path.join(root, 'www', 'scripts'));
      const handler = createRequestHandler(config, fs);

      req.url = '/styles/file2.css';

      await handler(req, res);
      expect(res.$statusCode).toBe(404);
      expect(res.$content).toContain('/styles/file2.css');
      expect(res.$contentType).toBe('text/plain');
    });

    it('not find html file', async () => {
      const handler = createRequestHandler(config, fs);

      req.url = '/www/index.html';

      await handler(req, res);
      expect(res.$statusCode).toBe(404);
      expect(res.$content).toContain('/index.html');
      expect(res.$contentType).toBe('text/html');
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
      const handler = createRequestHandler(config, fs);

      req.url = '/?qs=123';

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


function readResponse(res: http.ServerRequest) {
  let content = '';

  res.on('data', chunk => {
    content += chunk;
  });

  return content;
}


interface TestServerResponse extends http.ServerResponse {
  $statusCode: number;
  $headers: any;
  $contentWrite: string;
  $content: string;
  $contentType: string;
}
