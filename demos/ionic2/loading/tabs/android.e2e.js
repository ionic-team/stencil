describe('loading/tabs: android', function() {

it('should init', function() {
  browser.get('http://localhost:8876/dist/e2e/loading/tabs/index.html?ionicplatform=android&ionicOverlayCreatedDiff=0&ionicanimate=false&snapshot=true');
});

"use strict";
it('should show default spinner', function () {
    element(by.css('.e2eLoadingTabsContent')).click();
});

});
