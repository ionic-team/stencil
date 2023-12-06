import Sizzle from 'sizzle';
export function matches(selector, elm) {
    const r = Sizzle.matches(selector, [elm]);
    return r.length > 0;
}
export function selectOne(selector, elm) {
    const r = Sizzle(selector, elm);
    return r[0] || null;
}
export function selectAll(selector, elm) {
    return Sizzle(selector, elm);
}
//# sourceMappingURL=selector.js.map