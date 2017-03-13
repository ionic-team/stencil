describe('radio/basic: ios', function() {

it('should init', function() {
  browser.get('http://localhost:8876/dist/e2e/radio/basic/index.html?ionicplatform=ios&ionicOverlayCreatedDiff=0&ionicanimate=false&snapshot=true');
});

"use strict";
it('should check Cherry', function () {
    element(by.css('[value="cherry"] button')).click();
});

});
