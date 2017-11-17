# Official Stencil's Style Guide

## Disclosure

This is a renference guide created and enforced internally by the core team of stencil.
We recommend to follow it for outsiders too, but it is not mandatory.
Some projects though, could have a different policy of how stricly this guide must be applied.

## File structure

- Only one component per file.
- Implementation (.tsx) and styles of a component should live in the same folder.
- One component per folder unless components share the styles and are strongly coupled.

Example from ioni-core:

```
├── card
│   ├── card.ios.scss
│   ├── card.md.scss
│   ├── card.scss
│   ├── card.tsx
│   └── test
│       └── basic
│           ├── e2e.js
│           └── index.html
├── card-content
│   ├── card-content.ios.scss
│   ├── card-content.md.scss
│   ├── card-content.scss
│   └── card-content.tsx
├── card-header
│   ├── card-header.ios.scss
│   ├── card-header.md.scss
│   ├── card-header.scss
│   └── card-header.tsx
├── card-subtitle
│   ├── card-subtitle.ios.scss
│   ├── card-subtitle.md.scss
│   ├── card-subtitle.scss
│   └── card-subtitle.tsx
├── card-title
│   ├── card-title.ios.scss
│   ├── card-title.md.scss
│   ├── card-title.scss
```

Or tabs, where all them live in the same folder:

```
├── tabs
│   ├── page-tab.tsx
│   ├── tab-bar.tsx
│   ├── tab-button.tsx
│   ├── tab-highlight.tsx
│   ├── tab.tsx
│   ├── tabs.ios.scss
│   ├── tabs.md.scss
│   ├── tabs.scss
│   ├── tabs.tsx
│   └── test
│       └── basic
│           ├── e2e.js
│           └── index.html
```

## Naming
### HTML tag

#### Prefix
The prefix has a mayor role when you are creating a collection of components intended to be used across diferent projects, like ionic-core. WCs are not scoped, ie. they are globally declared, that means an "unique" prefix is needed to prevent collisions, they are help to quickly indentify the collection of an component.

We don't recommend using "stencil" as prefix, since stencil DOES NOT emit stencil components, but standard compliant web components.

DO NOT do this:
```
stencil-component
stnl-component
```

Instead, use your own naming or brand.

#### Name

Components are not actions, they are conceptually "things". It is better to use nouns, instead of verbs, such us: "animation" instead of "animating". "input", "tab", "nav", "menu" are some examples.

#### Modifiers

When several components are related and/or coupled, it is a good idea to share the name, and then add different modifiers, for example:

```
ion-menu
ion-menu-controller
```

```
ion-card
ion-card-header
ion-card-content
ion-card-footer
```

### Component (TS class)

The name of the ES6 class of the components SHOULD NOT have prefix since classes are scoped. There is not risk of collision.

```ts
@Component({tag: 'ion-menu'})
export class Menu {}

@Component({tag: 'ion-menu-controller'})
export class MenuController {}

@Component({tag: 'page-home'})
export class PageHome {}
```

## TypeScript

1. **Follow** [tslint-ionic-rules](https://github.com/ionic-team/tslint-ionic-rules/blob/master/tslint.js)

2. **Use private variables and methods as much possible:** They are useful to detect deadcode and enforce encapsulation.

3. **Variable decorators should be inlined.**

 ```ts
@Prop() name: string;
@Element() private el: HTMLElement;
```

4. **Method decorator should be multi-line**

 ```ts
@Listen('click')
onClick() {
}
```

## Code organization

### Newspaper Metaphor from The Robert C. Martin's Clean Code

> The source file should be organized like a newspaper article, with the highest level summary at the top, and more and more details further down. Functions called from the top function come directly below it, and so on down to the lowest level and most detailed functions at the bottom. This is a good way to organize the source code, even though IDE:s make the location of functions less important, since it is so easy to navigate in and out of them.

### High level example (commented)

```ts
@Component({
  tag: 'ion-something',
  styleUrl: 'something.scss',
  styleUrls: {
    ios: 'something.ios.scss',
    md: 'something.md.scss',
    wp: 'something.wp.scss'
  },
  host: {
    theme: 'something'
  }
})
export class Something {

  /**
   * 1. Private variables
   */
  private internal: string;
  private text = 'default';
  private number = 1;

  /**
   * 2. Public variables, references to the instance might need to access.
   */
  mode: string;
  color: string;
  isAnimating: boolean = false;
  isRightSide: boolean = false;
  width: number = null;


  /**
   * 3. Reference to host HTML element.
   * Private and inlined decorator
   */
  @Element() private el: HTMLElement;

  /**
   * 4. State() variables
   * Inlined decorator.
   */
  @State() status = 0;

  /**
   * 5. Internal props (context and connect)
   * Inlined decorator.
   */
  @Prop({ context: 'config' }) config: Config;
  @Prop({ connect: 'ion-menu-controller' }) lazyMenuCtrl: Lazy<MenuController>;

  /**
   * 6. Input public API
   * Inlined decorator.
   */
  @Prop() content: string;
  @Prop() menuId: string;
  @Prop() type: string = 'overlay';
  @Prop({ mutable: true }) enabled: boolean;

  /**
   * NOTE: Prop lifecycle events SHOULD go just behind the Prop they listen to.
   * This makes sense since both statements are strongly connected.
   * - Refacting the instance variable name, must also update the name in @PropDidChange()
   * - Code is easier to follow and maintain.
   */
  @Prop() swipeEnabled: boolean = true;
  @PropDidChange('swipeEnabled')
  swipeEnabledChange() {
    this.updateState();
  }

  /**
   * 7. Events section
   * Inlined decorator.
   */
  @Event() ionDrag: EventEmitter;
  @Event() ionOpen: EventEmitter;
  @Event() ionClose: EventEmitter;

  /**
   * 8. Component lifecycle events
   * Lifecycle methods SHOULD be protected.
   */
  protected componentWillLoad() {}
  protected componentDidLoad() {}
  protected componentDidUnload() {}

  /**
   * 9. Listeners
   * It is ok to place them in a different location
   * if makes more sense in the context.
   *
   * Always use two lines.
   */
  @Listen('click', {enabled: false})
  protected onClick(ev: UIEvent) {
    console.log('hi!')
  }

  /**
   * 10. Public methods API
   * Always use two lines
   */
  @Method()
  open() { }

  @Method()
  close() {}

  /**
   * 11. Private methods
   * Internal business logic
   */
  private prepareAnimation(): Promise<void> {
  }

  private updateState() {
  }

  /**
   * 12. hostData() function
   * SHOULD be protected
   */
  protected hostData() {
    return {
      attribute: 'navigation',
      side: this.isRightSide ? 'right' : 'left',
      type: this.type,
      class: {
        'something-is-animating': this.isAnimating
      }
    };
  }

  /**
   * 13. render() function
   * Always the last one in the class
   * SHOULD be protected
   */
  protected render() {
    return (
      <div class='menu-inner page-inner'>
        <slot></slot>
      </div>
    );
  }
}
```
