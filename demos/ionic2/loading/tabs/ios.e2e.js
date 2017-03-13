describe('loading/tabs: ios', function() {

it('should init', function() {
  browser.get('http://localhost:8876/dist/e2e/loading/tabs/index.html?ionicplatform=ios&ionicOverlayCreatedDiff=0&ionicanimate=false&snapshot=true');
});

"use strict";
it('should show default spinner', function () {
    element(by.css('.e2eLoadingTabsContent')).click();
});

});
