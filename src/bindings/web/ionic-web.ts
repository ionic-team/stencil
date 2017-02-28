
import { IonBadge } from '../../components/badge/badge';


const elements: {[tag: string]: Object} = {
  'ion-badge': IonBadge
};


const tags = Object.keys(elements);
tags.forEach(tag => {
  (<any>window).customElements.define(tag, elements[tag]);
});
