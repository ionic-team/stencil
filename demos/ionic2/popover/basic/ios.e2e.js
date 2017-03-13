describe('popover/basic: ios', function() {

it('should init', function() {
  browser.get('http://localhost:8876/dist/e2e/popover/basic/index.html?ionicplatform=ios&ionicOverlayCreatedDiff=0&ionicanimate=false&snapshot=true');
});

"use strict";
it('should open list popover', function () {
    element(by.css('.e2eOpenListPopover')).click();
});

});
