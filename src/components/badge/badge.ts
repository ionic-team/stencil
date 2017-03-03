import { IonElement, h, VNode } from '../../element/ion-element';


export class IonBadge extends IonElement {

  render(): VNode {
    return h('.badge');
  }

}

IonBadge.prototype['$css'] = `
ion-badge {
  display: inline-block;
  padding: 3px 8px;
  min-width: 10px;
  font-size: 1.3rem;
  font-weight: bold;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline; }

ion-badge:empty {
  display: none; }

.badge-ios {
  border-radius: 10px;
  color: #fff;
  background-color: #327eff; }

.badge-ios-primary {
  color: #fff;
  background-color: #327eff; }

.badge-ios-secondary {
  color: #fff;
  background-color: #32db64; }

.badge-ios-danger {
  color: #fff;
  background-color: #f53d3d; }

.badge-ios-light {
  color: #000;
  background-color: #f4f4f4; }

.badge-ios-dark {
  color: #fff;
  background-color: #222; }

.badge-md {
  border-radius: 4px;
  color: #fff;
  background-color: #327eff; }

.badge-md-primary {
  color: #fff;
  background-color: #327eff; }

.badge-md-secondary {
  color: #fff;
  background-color: #32db64; }

.badge-md-danger {
  color: #fff;
  background-color: #f53d3d; }

.badge-md-light {
  color: #000;
  background-color: #f4f4f4; }

.badge-md-dark {
  color: #fff;
  background-color: #222; }

.badge-wp {
  border-radius: 0;
  color: #fff;
  background-color: #327eff; }

.badge-wp-primary {
  color: #fff;
  background-color: #327eff; }

.badge-wp-secondary {
  color: #fff;
  background-color: #32db64; }

.badge-wp-danger {
  color: #fff;
  background-color: #f53d3d; }

.badge-wp-light {
  color: #000;
  background-color: #f4f4f4; }

.badge-wp-dark {
  color: #fff;
  background-color: #222; }
`;
