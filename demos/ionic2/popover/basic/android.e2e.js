describe('popover/basic: android', function() {

it('should init', function() {
  browser.get('http://localhost:8876/dist/e2e/popover/basic/index.html?ionicplatform=android&ionicOverlayCreatedDiff=0&ionicanimate=false&snapshot=true');
});

"use strict";
it('should open list popover', function () {
    element(by.css('.e2eOpenListPopover')).click();
});

});
