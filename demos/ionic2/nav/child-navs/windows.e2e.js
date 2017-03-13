describe('nav/child-navs: windows', function() {

it('should init', function() {
  browser.get('http://localhost:8876/dist/e2e/nav/child-navs/index.html?ionicplatform=windows&ionicOverlayCreatedDiff=0&ionicanimate=false&snapshot=true');
});

"use strict";
it('should go to nested children', function () {
    element(by.css('.e2eChildNavsNested')).click();
});

});
