describe('virtual-scroll/media: ios', function() {

it('should init', function() {
  browser.get('http://localhost:8876/dist/e2e/virtual-scroll/media/index.html?ionicplatform=ios&ionicOverlayCreatedDiff=0&ionicanimate=false&snapshot=true');
});

"use strict";
it('should check the first checkbox, toggle, and radio', function () {
    element(by.css('.item-0 .checkbox')).click();
    element(by.css('.item-2 .toggle')).click();
    element(by.css('.item-4 .radio')).click();
});

});
