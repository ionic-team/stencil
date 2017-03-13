describe('searchbar/nav: android', function() {

it('should init', function() {
  browser.get('http://localhost:8876/dist/e2e/searchbar/nav/index.html?ionicplatform=android&ionicOverlayCreatedDiff=0&ionicanimate=false&snapshot=true');
});

"use strict";
it('should navigate to details', function () {
    element(by.css('.e2eSearchbarNavItem:first-child')).click();
});

});
