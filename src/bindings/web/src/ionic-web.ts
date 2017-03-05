
if (!customElements) {
  throw new Error('Ionic requires custom element support');
}

import { defineElements } from '../../../utils/helpers';


import {
  IonApp,
  IonBadge,
  IonButton,
  IonContent,
  IonItem,
  IonList
} from '../../../components/index';


defineElements(window, {
  'ion-app': IonApp,
  'ion-badge': IonBadge,
  'ion-button': IonButton,
  'ion-content': IonContent,
  'ion-item': IonItem,
  'ion-list': IonList
});
