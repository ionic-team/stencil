
if (!customElements) {
  throw new Error('Ionic requires custom element support');
}

import { defineElements } from '../../../../utils/helpers';


import {
  IonBadge
} from '../../../../components/index';


defineElements(window, {
  'ion-badge': IonBadge,
});
