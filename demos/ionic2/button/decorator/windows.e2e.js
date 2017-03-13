describe('button/decorator: windows', function() {

it('should init', function() {
  browser.get('http://localhost:8876/dist/e2e/button/decorator/index.html?ionicplatform=windows&ionicOverlayCreatedDiff=0&ionicanimate=false&snapshot=true');
});

"use strict";
it('should click edit button', function () {
    element(by.css('.e2eButtonEdit')).click();
});

});
