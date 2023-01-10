/**
 * Helper method for querying a `meta` tag that contains a nonce value
 * out of a DOM's head.
 *
 * @param doc The DOM containing the `head` to query against
 * @returns The content of the meta tag representing the nonce value, `undefined` if no tag exists, or
 * `null` if the tag has no content.
 */
export function queryNonceMetaTagContent(doc: Document): string | null | undefined {
  return doc.head?.querySelector('meta[name="csp-nonce"]')?.getAttribute('content');
}
