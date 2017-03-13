describe('toggle/basic: android', function() {

it('should init', function() {
  browser.get('http://localhost:8876/dist/e2e/toggle/basic/index.html?ionicplatform=android&ionicOverlayCreatedDiff=0&ionicanimate=false&snapshot=true');
});

"use strict";
it('should check apple via switch element click', function () {
    element(by.css('[formControlName="apple"]')).click();
});
it('should enable/check grape via buttons and submit form', function () {
    element(by.css('.e2eGrapeDisabled')).click();
    element(by.css('.e2eGrapeChecked')).click();
    element(by.css('.e2eSubmit')).click();
});

});
