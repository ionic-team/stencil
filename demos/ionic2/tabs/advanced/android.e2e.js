describe('tabs/advanced: android', function() {

it('should init', function() {
  browser.get('http://localhost:8876/dist/e2e/tabs/advanced/index.html?ionicplatform=android&ionicOverlayCreatedDiff=0&ionicanimate=false&snapshot=true');
});

"use strict";
it('should go to Tab1 Page1', function () {
    element(by.css('.e2eSignIn')).click();
});
it('should go to Tab1 Page2', function () {
    element(by.css('.e2eGoToTab1Page2')).click();
});
it('should go back to Tab1 Page1', function () {
    element(by.css('.e2eBackToTab1Page1')).click();
});
it('should go to Tab2 Page1', function () {
    element(by.css('.tab-button:nth-of-type(2)')).click();
});
it('should go back to Tab1 Page1', function () {
    element(by.css('.tab-button:nth-of-type(1)')).click();
});

});
