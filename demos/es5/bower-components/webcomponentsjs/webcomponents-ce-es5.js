(function () {
'use strict';

(()=>{'use strict';if(!window.customElements)return;const a=window.HTMLElement,b=window.customElements.define,c=window.customElements.get,d=new Map,e=new Map;let f=!1,g=!1;window.HTMLElement=function(){if(!f){const h=d.get(this.constructor),i=c.call(window.customElements,h);g=!0;const j=new i;return j}f=!1;},window.HTMLElement.prototype=a.prototype,window.customElements.define=(h,i)=>{const j=i.prototype,k=class extends a{constructor(){super(),Object.setPrototypeOf(this,j),g||(f=!0,i.call(this)),g=!1;}},l=k.prototype;k.observedAttributes=i.observedAttributes,l.connectedCallback=j.connectedCallback,l.disconnectedCallback=j.disconnectedCallback,l.attributeChangedCallback=j.attributeChangedCallback,l.adoptedCallback=j.adoptedCallback,d.set(i,h),e.set(h,i),b.call(window.customElements,h,k);},window.customElements.get=(h)=>e.get(h);})();

(function(){'use strict';var a=document.createElement('style');a.textContent='body {transition: opacity ease-in 0.2s; } \\nbody[unresolved] {opacity: 0; display: block; overflow: hidden; position: relative; } \\n';var b=document.querySelector('head');b.insertBefore(a,b.firstChild);})();

/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/requestAnimationFrame(()=>{window.dispatchEvent(new CustomEvent('WebComponentsReady'));});

}());
