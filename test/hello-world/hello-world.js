const HelloWorld = class extends HTMLElement {
    render() {
        return ('Hello World');
    }
    connectedCallback() {
        this.textContent = this.render();
    }
};

export { HelloWorld };
