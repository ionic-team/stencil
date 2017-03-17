import { ProxyComponent, ComponentInstance } from '../utils/interfaces';
import { PlatformApi } from '../platform/platform-api';
import { attributeChangedCallback } from './attribute-changed';
import { connectedCallback } from './connected';
import { disconnectedCallback } from './disconnected';
import { Config } from '../utils/config';


export class ProxyElement extends HTMLElement implements ProxyComponent {
  $instance: ComponentInstance;
  $queued: boolean;

  constructor(public $plt: PlatformApi, public $config: Config, public $tag: string) {
    super();
  }

  connectedCallback() {
    const self = this;
    self.$plt.loadComponentModule(self.$tag, (cmpMeta, cmpModule) => {
      connectedCallback(self.$plt, self.$config, self, self.$tag, cmpMeta, cmpModule);
    });
  }

  attributeChangedCallback(attrName: string, oldVal: string, newVal: string, namespace: string) {
    attributeChangedCallback(this.$instance, attrName, oldVal, newVal, namespace);
  }

  disconnectedCallback() {
    disconnectedCallback(this.$instance);
    this.$instance = null;
  }

}
