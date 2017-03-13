describe('menu/basic: windows', function() {

it('should init', function() {
  browser.get('http://localhost:8876/dist/e2e/menu/basic/index.html?ionicplatform=windows&ionicOverlayCreatedDiff=0&ionicanimate=false&snapshot=true');
});

"use strict";
it('should toggle left menu', function () {
    element(by.css('.e2eContentToggleLeftMenu')).click();
});
it('should close left menu', function () {
    element(by.css('.e2eCloseLeftMenu')).click();
});
it('should toggle right menu', function () {
    element(by.css('.e2eContentToggleRightMenu')).click();
});
it('should close right menu', function () {
    element(by.css('.e2eCloseRightMenu')).click();
});

});
