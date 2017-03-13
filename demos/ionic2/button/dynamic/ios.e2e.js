describe('button/dynamic: ios', function() {

it('should init', function() {
  browser.get('http://localhost:8876/dist/e2e/button/dynamic/index.html?ionicplatform=ios&ionicOverlayCreatedDiff=0&ionicanimate=false&snapshot=true');
});

"use strict";
it('should unify buttons', function () {
    element(by.css('.e2eButtonDynamicUnify')).click();
});
it('should toggle buttons', function () {
    element(by.css('.e2eButtonToggle')).click();
});

});
