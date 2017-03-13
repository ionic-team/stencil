describe('nav/child-navs: ios', function() {

it('should init', function() {
  browser.get('http://localhost:8876/dist/e2e/nav/child-navs/index.html?ionicplatform=ios&ionicOverlayCreatedDiff=0&ionicanimate=false&snapshot=true');
});

"use strict";
it('should go to nested children', function () {
    element(by.css('.e2eChildNavsNested')).click();
});

});
