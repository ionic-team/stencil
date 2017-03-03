
if (!customElements) {
  throw new Error('Ionic requires native custom element support or a polyfill');
}

import { defineElements } from '../../../utils/helpers';

import {
  IonBadge,
  IonButton,
  IonItem
} from '../../../components/index';


defineElements(window, {
  'ion-badge': IonBadge,
  'ion-button': IonButton,
  'ion-item': IonItem
});
