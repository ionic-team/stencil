
if (!customElements) {
  throw new Error('Ionic requires custom element support');
}

import { defineElements } from '../../../utils/helpers';


import {
  IonApp,
  IonAvatar,
  IonBadge,
  IonBarButtons,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonElement,
  IonHeader,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonList,
  IonListHeader,
  IonNav,
  IonNavbar,
  IonThumbnail,
  IonTitle,
  IonToolbar
} from '../../../components/index';


defineElements(window, {
  'ion-app': IonApp,
  'ion-avatar': IonAvatar,
  'ion-badge': IonBadge,
  'ion-button': IonButton,
  'ion-buttons': IonBarButtons,
  'ion-card': IonCard,
  'ion-card-content': IonCardContent,
  'ion-card-header': IonCardHeader,
  'ion-card-title': IonCardTitle,
  'ion-content': IonContent,
  'ion-header': IonHeader,
  'ion-item': IonItem,
  'ion-item-divider': IonItemDivider,
  'ion-item-group': IonItemGroup,
  'ion-label': IonLabel,
  'ion-list': IonList,
  'ion-list-header': IonListHeader,
  'ion-nav': IonNav,
  'ion-navbar': IonNavbar,
  'ion-thumbnail': IonThumbnail,
  'ion-title': IonTitle,
  'ion-toolbar': IonToolbar
});
