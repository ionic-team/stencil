import { MockClassList } from '../class-list';
import { MockDocument } from '../document';
import { MockElement } from '../node';
describe('class-list', () => {
    let classList;
    beforeEach(() => {
        const doc = new MockDocument();
        const el = new MockElement(doc, 'div');
        classList = new MockClassList(el);
    });
    it('add and remove classes', () => {
        classList.add('one');
        classList.add('two', 'three');
        classList.add(null);
        classList.add(undefined);
        classList.add(1, 2);
        expect(classList.toString()).toEqual('one two three null undefined 1 2');
        expect(classList.contains('one')).toBe(true);
        expect(classList.contains('two')).toBe(true);
        expect(classList.contains('three')).toBe(true);
        expect(classList.contains('null')).toBe(true);
        expect(classList.contains(null)).toBe(true);
        expect(classList.contains('undefined')).toBe(true);
        expect(classList.contains('1')).toBe(true);
        expect(classList.contains(2)).toBe(true);
        classList.remove('one');
        classList.remove('two', 'three');
        classList.remove(null);
        classList.remove(undefined);
        classList.remove(1, 2);
        expect(classList.toString()).toEqual('');
    });
    it('should throw if empty', () => {
        expect(() => {
            classList.add('');
        }).toThrow();
        expect(() => {
            classList.remove('');
        }).toThrow();
    });
    it('should throw if has spaces', () => {
        expect(() => {
            classList.add('');
        }).toThrow();
        expect(() => {
            classList.remove(' ');
        }).toThrow();
    });
});
//# sourceMappingURL=class-list.spec.js.map