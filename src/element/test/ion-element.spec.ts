import { IonElement } from '../ion-element';


describe('IonElement', function() {
  let ionElement: IonElement;

  beforeEach(function() {
    ionElement = new IonElement();
  });

  it('should add $config to instance', function() {
    expect(ionElement.$config).toBeDefined();
  });

  it('should add $dom to instance', function() {
    expect(ionElement.$dom).toBeDefined();
  });

});
