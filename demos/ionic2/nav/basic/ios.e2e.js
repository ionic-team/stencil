describe('nav/basic: ios', function() {

it('should init', function() {
  browser.get('http://localhost:8876/dist/e2e/nav/basic/index.html?ionicplatform=ios&ionicOverlayCreatedDiff=0&ionicanimate=false&snapshot=true');
});

"use strict";
it('should go from 1 to 2', function () {
    element(by.css('.e2eFrom1To2')).click();
});
it('should go from 2 to 3', function () {
    element(by.css('.e2eFrom2To3')).click();
});
it('should go from 3 to 2', function () {
    element(by.css('.e2eFrom3To2')).click();
});
it('should go from 2 to 1', function () {
    element(by.css('.e2eFrom2To1')).click();
});

});
