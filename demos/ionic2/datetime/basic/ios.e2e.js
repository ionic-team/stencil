describe('datetime/basic: ios', function() {

it('should init', function() {
  browser.get('http://localhost:8876/dist/e2e/datetime/basic/index.html?ionicplatform=ios&ionicOverlayCreatedDiff=0&ionicanimate=false&snapshot=true');
});

"use strict";
it('should open basic datetime picker', function () {
    element(by.css('.e2eOpenMMDDYYYY')).click();
});
it('should close with Done button click', function () {
    element(by.css('.picker-toolbar-button:last-child .button')).click();
});

});
