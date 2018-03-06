import { _deprecatedToMultipleTarget } from '../_deprecated-validate-multiple-targets';

describe('_deprecated multiple targets', () => {
  it('do nothing if outputTargets already provided', () => {
    const config = _deprecatedToMultipleTarget({
      outputTargets: {
        www: {
          dir: 'www',
          emptyDir: true
        },
        distribution: {
          dir: 'dist',
          emptyDir: true
        }
      }
    });

    expect(config).toEqual({
      outputTargets: {
        www: {
          dir: 'www',
          emptyDir: true
        },
        distribution: {
          dir: 'dist',
          emptyDir: true
        }
      }
    });
  });

  it('no configuration is provided should default to www and dist filled out', () => {
    const config = _deprecatedToMultipleTarget({});

    expect(config).toEqual({
      outputTargets: {
        www: {
          dir: 'www',
          emptyDir: true
        }
      }
    });
  });

  it('should use provided values', () => {
    const config = _deprecatedToMultipleTarget({
      wwwDir: 'wwwdir',
      emptyWWW: false,
      distDir: 'distdir',
      emptyDist: false
    });

    expect(config).toEqual({
      outputTargets: {
        www: {
          dir: 'wwwdir',
          emptyDir: false
        },
        distribution: {
          dir: 'distdir',
          emptyDir: false
        }
      }
    });
  });
});
