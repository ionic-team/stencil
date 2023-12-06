import { BUILD } from '@app-data';
import { getHostRef } from '@platform';
export const getElement = (ref) => (BUILD.lazyLoad ? getHostRef(ref).$hostElement$ : ref);
//# sourceMappingURL=element.js.map