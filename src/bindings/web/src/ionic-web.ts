
if (!customElements) {
  throw new Error('Ionic requires custom element support');
}

import { defineElements } from '../../../utils/helpers';


import {
  IonApp,
  IonBadge,
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonTitle,
  IonToolbar
} from '../../../components/index';


defineElements(window, {
  'ion-app': IonApp,
  'ion-badge': IonBadge,
  'ion-button': IonButton,
  'ion-content': IonContent,
  'ion-header': IonHeader,
  'ion-item': IonItem,
  'ion-list': IonList,
  'ion-title': IonTitle,
  'ion-toolbar': IonToolbar
});
