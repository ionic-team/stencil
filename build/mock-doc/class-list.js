export class MockClassList {
    constructor(elm) {
        this.elm = elm;
    }
    add(...classNames) {
        const clsNames = getItems(this.elm);
        let updated = false;
        classNames.forEach((className) => {
            className = String(className);
            validateClass(className);
            if (clsNames.includes(className) === false) {
                clsNames.push(className);
                updated = true;
            }
        });
        if (updated) {
            this.elm.setAttributeNS(null, 'class', clsNames.join(' '));
        }
    }
    remove(...classNames) {
        const clsNames = getItems(this.elm);
        let updated = false;
        classNames.forEach((className) => {
            className = String(className);
            validateClass(className);
            const index = clsNames.indexOf(className);
            if (index > -1) {
                clsNames.splice(index, 1);
                updated = true;
            }
        });
        if (updated) {
            this.elm.setAttributeNS(null, 'class', clsNames.filter((c) => c.length > 0).join(' '));
        }
    }
    contains(className) {
        className = String(className);
        return getItems(this.elm).includes(className);
    }
    toggle(className) {
        className = String(className);
        if (this.contains(className) === true) {
            this.remove(className);
        }
        else {
            this.add(className);
        }
    }
    get length() {
        return getItems(this.elm).length;
    }
    item(index) {
        return getItems(this.elm)[index];
    }
    toString() {
        return getItems(this.elm).join(' ');
    }
}
function validateClass(className) {
    if (className === '') {
        throw new Error('The token provided must not be empty.');
    }
    if (/\s/.test(className)) {
        throw new Error(`The token provided ('${className}') contains HTML space characters, which are not valid in tokens.`);
    }
}
function getItems(elm) {
    const className = elm.getAttribute('class');
    if (typeof className === 'string' && className.length > 0) {
        return className
            .trim()
            .split(' ')
            .filter((c) => c.length > 0);
    }
    return [];
}
//# sourceMappingURL=class-list.js.map