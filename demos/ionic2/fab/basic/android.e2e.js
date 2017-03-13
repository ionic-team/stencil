describe('fab/basic: android', function() {

it('should init', function() {
  browser.get('http://localhost:8876/dist/e2e/fab/basic/index.html?ionicplatform=android&ionicOverlayCreatedDiff=0&ionicanimate=false&snapshot=true');
});

"use strict";
it('should open fab lists ', function () {
    element(by.css('.e2eFabTopRight')).click();
    element(by.css('.e2eFabBottomRight')).click();
    element(by.css('.e2eFabTopLeft')).click();
    element(by.css('.e2eFabBottomLeft')).click();
    element(by.css('.e2eFabCenter')).click();
});

});
