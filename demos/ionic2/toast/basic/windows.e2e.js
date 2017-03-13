describe('toast/basic: windows', function() {

it('should init', function() {
  browser.get('http://localhost:8876/dist/e2e/toast/basic/index.html?ionicplatform=windows&ionicOverlayCreatedDiff=0&ionicanimate=false&snapshot=true');
});

"use strict";
it('should open toast', function () {
    element(by.css('.e2eOpenToast')).click();
});

});
