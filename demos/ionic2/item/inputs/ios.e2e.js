describe('item/inputs: ios', function() {

it('should init', function() {
  browser.get('http://localhost:8876/dist/e2e/item/inputs/index.html?ionicplatform=ios&ionicOverlayCreatedDiff=0&ionicanimate=false&snapshot=true');
});

"use strict";
it('should disable all inputs', function () {
    element(by.css('.e2eDisableButton')).click();
});

});
