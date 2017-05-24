import { Component, h, Ionic, Listen } from '../index';
import { VNodeData } from '../../util/interfaces';


@Component({
  tag: 'ion-item',
  styleUrls: {
    ios: 'item.ios.scss',
    md: 'item.md.scss',
    wp: 'item.wp.scss'
  },
  shadow: false
})
export class Item {
  childStyles: {[className: string]: boolean} = Object.create(null);

  @Listen('ionStyle')
  itemStyle(ev: UIEvent) {
    ev.stopPropagation();

    let hasChildStyleChange = false;
    let updatedStyles: any = ev.detail;

    for (var key in updatedStyles) {
      if (updatedStyles[key] !== this.childStyles['item-' + key]) {
        this.childStyles['item-' + key] = updatedStyles[key];
        hasChildStyleChange = true;
      }
    }

    // returning true tells the renderer to queue an update
    return hasChildStyleChange;
  }

  render() {
    const themeVNode: VNodeData = { class: {} };
    Object.assign(themeVNode.class, this.childStyles);

    return h(this,
      h('div.item-block', Ionic.theme(this, 'item', themeVNode),
        [
          h('slot', { attrs: { name: 'start' } }),
          h('div.item-inner', [
              h('div.input-wrapper',
                h('slot')
              ),
              h('slot', { attrs: { name: 'end' } }),
              // h('ion-reorder')
            ]
          ),
          // h('div.button-effect')
        ]
      )
    );
    // template:
    //   '<ng-content select="[slot="start"],ion-checkbox:not([slot="end"])"></ng-content>' +
    //   '<div class="item-inner">' +
    //     '<div class="input-wrapper">' +
    //       '<ng-content select="ion-label"></ng-content>' +
    //       '<ion-label *ngIf="_viewLabel">' +
    //         '<ng-content></ng-content>' +
    //       '</ion-label>' +
    //       '<ng-content select="ion-select,ion-input,ion-textarea,ion-datetime,ion-range,[item-content]"></ng-content>' +
    //     '</div>' +
    //     '<ng-content select="[slot="end"],ion-radio,ion-toggle"></ng-content>' +
    //     '<ion-reorder *ngIf="_hasReorder"></ion-reorder>' +
    //   '</div>' +
    //   '<div class="button-effect"></div>',
  }


  // _ids: number = -1;
  // _inputs: Array<string> = [];
  // _label: Label;
  // _viewLabel: boolean = true;
  // _name: string = 'item';
  // _hasReorder: boolean;

  // /**
  //  * @hidden
  //  */
  // id: string;

  // /**
  //  * @hidden
  //  */
  // labelId: string = null;

  // constructor(
  //   form: Form,
  //   config: Config,
  //   elementRef: ElementRef,
  //   renderer: Renderer,
  //   @Optional() reorder: ItemReorder
  // ) {
  //   super(config, elementRef, renderer, 'item');

  //   this._setName(elementRef);
  //   this._hasReorder = !!reorder;
  //   this.id = form.nextId().toString();

  //   // auto add "tappable" attribute to ion-item components that have a click listener
  //   if (!(<any>renderer).orgListen) {
  //     (<any>renderer).orgListen = renderer.listen;
  //     renderer.listen = function(renderElement: HTMLElement, name: string, callback: Function): Function {
  //       if (name === 'click' && renderElement.setAttribute) {
  //         renderElement.setAttribute('tappable', '');
  //       }
  //       return (<any>renderer).orgListen(renderElement, name, callback);
  //     };
  //   }
  // }

  // /**
  //  * @hidden
  //  */
  // registerInput(type: string) {
  //   this._inputs.push(type);
  //   return this.id + '-' + (++this._ids);
  // }

  // /**
  //  * @hidden
  //  */
  // ngAfterContentInit() {
  //   if (this._viewLabel && this._inputs.length) {
  //     let labelText = this.getLabelText().trim();
  //     this._viewLabel = (labelText.length > 0);
  //   }

  //   if (this._inputs.length > 1) {
  //     this.setElementClass('item-multiple-inputs', true);
  //   }
  // }

  // /**
  //  * @hidden
  //  */
  // _updateColor(newColor: string, componentName?: string) {
  //   componentName = componentName || 'item'; // item-radio
  //   this._setColor(newColor, componentName);
  // }

  // /**
  //  * @hidden
  //  */
  // _setName(elementRef: ElementRef) {
  //   let nodeName = elementRef.nativeElement.nodeName.replace('ION-', '');

  //   if (nodeName === 'LIST-HEADER' || nodeName === 'ITEM-DIVIDER') {
  //     this._name = nodeName;
  //   }
  // }

  // /**
  //  * @hidden
  //  */
  // getLabelText(): string {
  //   return this._label ? this._label.text : '';
  // }

  // /**
  //  * @hidden
  //  */
  // @ContentChild(Label)
  // set contentLabel(label: Label) {
  //   if (label) {
  //     this._label = label;
  //     this.labelId = label.id = ('lbl-' + this.id);
  //     if (label.type) {
  //       this.setElementClass('item-label-' + label.type, true);
  //     }
  //     this._viewLabel = false;
  //   }
  // }

  // /**
  //  * @hidden
  //  */
  // @ViewChild(Label)
  // set viewLabel(label: Label) {
  //   if (!this._label) {
  //     this._label = label;
  //   }
  // }

  // /**
  //  * @hidden
  //  */
  // @ContentChildren(Button)
  // set _buttons(buttons: QueryList<Button>) {
  //   buttons.forEach(button => {
  //     if (!button._size) {
  //       button.setElementClass('item-button', true);
  //     }
  //   });
  // }

  // /**
  //  * @hidden
  //  */
  // @ContentChildren(Icon)
  // set _icons(icons: QueryList<Icon>) {
  //   icons.forEach(icon => {
  //     icon.setElementClass('item-icon', true);
  //   });
  // }
}
