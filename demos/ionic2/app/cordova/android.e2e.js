describe('app/cordova: android', function() {

it('should init', function() {
  browser.get('http://localhost:8876/dist/e2e/app/cordova/index.html?ionicplatform=android&ionicOverlayCreatedDiff=0&ionicanimate=false&snapshot=true');
});

"use strict";
it('should navigate to page 2', function () {
    element(by.css('.e2eCordovaPage2')).click();
});
it('should navigate to page 3', function () {
    element(by.css('.e2eCordovaPage3')).click();
});
it('should navigate back', function () {
    element(by.css('.e2eCordovaGoBack')).click();
});
it('should open modal', function () {
    element(by.css('.e2eCordovaOpenModal')).click();
});
it('should close modal', function () {
    element(by.css('.e2eCordovaCloseModal')).click();
});

});
