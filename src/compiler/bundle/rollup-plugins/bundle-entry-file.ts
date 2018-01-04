import { Bundle } from '../../../util/interfaces';
import { generateBundleEntryInput } from '../bundle-entry-input';


export default function bundleEntryFile(bundles: Bundle[]) {

  return {
    name: 'bundleEntryFilePlugin',

    resolveId(importee: string) {
      const bundle = bundles.find(b => b.entryKey === importee);
      if (bundle) {
        return bundle.entryKey;
      }

      return null;
    },

    load(id: string) {
      const bundle = bundles.find(b => b.entryKey === id);
      if (bundle) {
        return generateBundleEntryInput(bundle);
      }

      return null;
    }
  };
}
