describe('badge/basic: android', function() {

it('should init', function() {
  browser.get('http://localhost:8876/dist/e2e/badge/basic/index.html?ionicplatform=android&ionicOverlayCreatedDiff=0&ionicanimate=false&snapshot=true');
});

"use strict";
it('should toggle color', function () {
    element(by.css('.e2eBadgeToggleColor')).click();
});

});
