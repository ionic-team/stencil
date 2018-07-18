import { DEV_SERVER_URL } from '../util';
import { mockConfig } from '../../testing/mocks';
import { getDevServerClientScript } from '../serve-dev-client';
import { normalizePath } from '../../compiler/util';
import { TestingFs } from '../../testing/testing-fs';
import { validateDevServer } from '../../compiler/config/validate-dev-server';
import * as d from '../../declarations';
import * as nodeFs from 'fs';
import * as path from 'path';


describe('dev-server, serve-dev-client', () => {

  let config: d.DevServerConfig;
  let fs: TestingFs;
  const root = path.resolve('/');
  const tmplDirPath = normalizePath(path.join(__dirname, '..', 'templates', 'dev-client-iframe.html'));
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
      root: normalizePath(path.join(root, 'www'))
    };

    await fs.mkdir(stencilConfig.devServer.root);
    await fs.writeFile(path.join(stencilConfig.devServer.devServerDir, 'templates', 'dev-client-iframe.html'), tmplDir);

    config = validateDevServer(stencilConfig);
  });

  it('should get iframe injection script with DEV_SERVER_URL included', async () => {
    const devServerClientScript = await getDevServerClientScript(config, fs);
    expect(devServerClientScript).toContain(DEV_SERVER_URL);
  });

});
