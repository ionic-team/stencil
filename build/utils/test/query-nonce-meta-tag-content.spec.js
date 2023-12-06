import { queryNonceMetaTagContent } from '../query-nonce-meta-tag-content';
describe('queryNonceMetaTagContent', () => {
    it('should return the nonce value if the tag exists', () => {
        const meta = document.createElement('meta');
        meta.setAttribute('name', 'csp-nonce');
        meta.setAttribute('content', '1234');
        document.head.appendChild(meta);
        const nonce = queryNonceMetaTagContent(document);
        expect(nonce).toEqual('1234');
    });
    it('should return `undefined` if the tag does not exist', () => {
        const nonce = queryNonceMetaTagContent(document);
        expect(nonce).toEqual(undefined);
    });
    it('should return `undefined` if the document does not have a head element', () => {
        const head = document.querySelector('head');
        head === null || head === void 0 ? void 0 : head.remove();
        const nonce = queryNonceMetaTagContent(document);
        expect(nonce).toEqual(undefined);
    });
    it('should return `undefined` if the tag has no content', () => {
        const meta = document.createElement('meta');
        meta.setAttribute('name', 'csp-nonce');
        document.head.appendChild(meta);
        const nonce = queryNonceMetaTagContent(document);
        expect(nonce).toEqual(undefined);
    });
});
//# sourceMappingURL=query-nonce-meta-tag-content.spec.js.map