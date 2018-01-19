import { Manifest, ManifestData } from '../../../util/interfaces';
import { parseBundles, serializeBundles } from '../manifest-data';


describe('manifest bundles', () => {

  it('parseBundles, user config includeBundledOnly=true', () => {
    const manifestData: ManifestData = {
      bundles: [
        { components: ['cmp-a', 'cmp-b'] },
        { components: ['cmp-c'] }
      ]
    };
    const manifest: Manifest = {};
    parseBundles(false, manifestData, manifest);
    expect(manifest.bundles[0].components[0]).toBe('cmp-a');
    expect(manifest.bundles[0].components[1]).toBe('cmp-b');
    expect(manifest.bundles[1].components[0]).toBe('cmp-c');
  });

  it('parseBundles', () => {
    const manifestData: ManifestData = {
      bundles: [
        { components: ['cmp-a', 'cmp-b'] },
        { components: ['cmp-c'] }
      ]
    };
    const manifest: Manifest = {};
    parseBundles(false, manifestData, manifest);
    expect(manifest.bundles[0].components[0]).toBe('cmp-a');
    expect(manifest.bundles[0].components[1]).toBe('cmp-b');
    expect(manifest.bundles[1].components[0]).toBe('cmp-c');
  });

  it('serializeBundles', () => {
    const manifest: Manifest = {};
    manifest.bundles = [
      { components: ['cmp-a', 'cmp-b'] },
      { components: ['cmp-c'] }
    ];

    const manifestData: ManifestData = {
      bundles: []
    };
    serializeBundles(manifestData, manifest);
    expect(manifestData.bundles[0].components[0]).toBe('cmp-a');
    expect(manifestData.bundles[0].components[1]).toBe('cmp-b');
    expect(manifestData.bundles[1].components[0]).toBe('cmp-c');
  });

});
