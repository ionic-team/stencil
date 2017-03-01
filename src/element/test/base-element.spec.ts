import { IonElement } from '../base-element';


describe('IonElement', function() {
  let ionElement: IonElement;

  beforeEach(function() {

  });

  it('should add $dom to instance', function() {
    ionElement = new IonElement();
    expect(ionElement.$dom).toBeDefined();
  });

});
