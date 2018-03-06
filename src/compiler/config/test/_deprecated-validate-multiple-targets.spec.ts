import { _deprecatedToMultipleTarget } from '../_deprecated-validate-multiple-targets';
import { Config } from '../../../declarations';

describe('_deprecated multiple targets', () => {
  it('do nothing if outputTargets already provided', () => {
    const config: Config = {
      outputTargets: {
        www: {
          dir: 'ww',
          emptyDir: true
        },
        distribution: {
          dir: 'dist',
          emptyDir: true
        }
      }
    };
    _deprecatedToMultipleTarget(config);

    expect(config).toEqual({
      outputTargets: {
        www: {
          emptyDir: true,
          dir: 'ww',
          buildDir: 'build',
          indexHtml: 'index.html'
        },
        distribution: {
          emptyDir: true,
          dir: 'dist',
        }
      }
    });
  });

  it('no configuration is provided should default to www and dist filled out', () => {
    const config: Config = {};
    _deprecatedToMultipleTarget(config);

    expect(config).toEqual({
      outputTargets: {
        www: {
          emptyDir: true,
          dir: 'www',
          buildDir: 'build',
          indexHtml: 'index.html'
        }
      }
    });
  });
  it('no configuration is provided should default to www and dist filled out', () => {
    const config: Config = {
      outputTargets: {}
    };
    _deprecatedToMultipleTarget(config);

    expect(config).toEqual({
      outputTargets: {}
    });
  });

  it('should use provided values', () => {
    const config: Config = {
      wwwDir: 'wwwdir',
      emptyWWW: false,
      generateDistribution: true,
      distDir: 'distdir',
      emptyDist: false
    };
    _deprecatedToMultipleTarget(config);

    expect(config).toEqual({
      outputTargets: {
        www: {
          emptyDir: false,
          dir: 'wwwdir',
          buildDir: 'build',
          indexHtml: 'index.html'
        },
        distribution: {
          emptyDir: false,
          dir: 'distdir',
        }
      }
    });
  });
});
