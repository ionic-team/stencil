
if (!customElements) {
  throw new Error('Ionic requires custom element support');
}

import { defineElements } from '../../../utils/helpers';


import {
  IonApp,
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonElement,
  IonHeader,
  IonItem,
  IonList,
  IonNav,
  IonTitle,
  IonToolbar
} from '../../../components/index';


defineElements(window, {
  'ion-app': IonApp,
  'ion-badge': IonBadge,
  'ion-button': IonButton,
  'ion-card': IonCard,
  'ion-card-content': IonCardContent,
  'ion-card-header': IonCardHeader,
  'ion-card-title': IonCardTitle,
  'ion-content': IonContent,
  'ion-header': IonHeader,
  'ion-item': IonItem,
  'ion-list': IonList,
  'ion-nav': IonNav,
  'ion-title': IonTitle,
  'ion-toolbar': IonToolbar
});
