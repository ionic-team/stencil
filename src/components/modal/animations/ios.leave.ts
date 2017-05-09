import { Ionic } from '../../index';


/**
 * iOS Modal Leave Animation
 */
export default function(rootElm: HTMLElement) {
  const baseAnimation = new Ionic.Animation();

  const backdropAnimatin = new Ionic.Animation();
  backdropAnimatin.addElement(rootElm.querySelector('ion-backdrop'));

  const wrapperAnimatin = new Ionic.Animation();
  wrapperAnimatin.addElement(rootElm.querySelector('.modal-wrapper'));

  wrapperAnimatin.beforeStyles({ 'opacity': 1 })
                 .fromTo('translateY', '0%', '100%');

  backdropAnimatin.fromTo('opacity', 0.4, 0.0);

  return baseAnimation
    .addElement(rootElm)
    .easing('ease-out')
    .duration(250)
    .addChildAnimation(backdropAnimatin)
    .addChildAnimation(wrapperAnimatin);
}
