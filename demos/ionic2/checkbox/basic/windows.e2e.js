describe('checkbox/basic: windows', function() {

it('should init', function() {
  browser.get('http://localhost:8876/dist/e2e/checkbox/basic/index.html?ionicplatform=windows&ionicOverlayCreatedDiff=0&ionicanimate=false&snapshot=true');
});

"use strict";
it('should check apple, enable/check grape, submit form', function () {
    element(by.css('[formControlName=apple]')).click();
    element(by.css('.e2eGrapeDisabled')).click();
    element(by.css('.e2eGrapeChecked')).click();
    element(by.css('.e2eSubmit')).click();
});

});
