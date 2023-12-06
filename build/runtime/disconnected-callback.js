import { BUILD } from '@app-data';
import { getHostRef, plt } from '@platform';
import { safeCall } from './update-component';
const disconnectInstance = (instance) => {
    if (BUILD.lazyLoad && BUILD.disconnectedCallback) {
        safeCall(instance, 'disconnectedCallback');
    }
    if (BUILD.cmpDidUnload) {
        safeCall(instance, 'componentDidUnload');
    }
};
export const disconnectedCallback = async (elm) => {
    if ((plt.$flags$ & 1 /* PLATFORM_FLAGS.isTmpDisconnected */) === 0) {
        const hostRef = getHostRef(elm);
        if (BUILD.hostListener) {
            if (hostRef.$rmListeners$) {
                hostRef.$rmListeners$.map((rmListener) => rmListener());
                hostRef.$rmListeners$ = undefined;
            }
        }
        if (!BUILD.lazyLoad) {
            disconnectInstance(elm);
        }
        else if (hostRef === null || hostRef === void 0 ? void 0 : hostRef.$lazyInstance$) {
            disconnectInstance(hostRef.$lazyInstance$);
        }
        else if (hostRef === null || hostRef === void 0 ? void 0 : hostRef.$onReadyPromise$) {
            hostRef.$onReadyPromise$.then(() => disconnectInstance(hostRef.$lazyInstance$));
        }
    }
};
//# sourceMappingURL=disconnected-callback.js.map