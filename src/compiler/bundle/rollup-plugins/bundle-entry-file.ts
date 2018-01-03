import { Bundle } from '../../../util/interfaces';
import { generateBundleEntryInput } from '../bundle-entry-input';


export default function bundleEntryFile(bundle: Bundle) {

  return {
    name: 'bundleEntryFilePlugin',

    resolveId(importee: string) {
      if (importee === bundle.entryKey) {
        return bundle.entryKey;
      }

      return null;
    },

    load(id: string) {
      if (id === bundle.entryKey) {
        return generateBundleEntryInput(bundle);
      }

      return null;
    }
  };
}
