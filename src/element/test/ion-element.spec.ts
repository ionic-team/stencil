import { IonElement } from '../ion-element';


describe('IonElement', function() {
  let ionElement: IonElement;

  beforeEach(function() {
    ionElement = new IonElement();
  });

  it('should add $ionic to instance', function() {
    spyOn(ionElement, 'update');
    ionElement.connectedCallback();
    expect(ionElement.update).toHaveBeenCalled();
  });

});
