describe('segment/nav: android', function() {

it('should init', function() {
  browser.get('http://localhost:8876/dist/e2e/segment/nav/index.html?ionicplatform=android&ionicOverlayCreatedDiff=0&ionicanimate=false&snapshot=true');
});

"use strict";
it('existing should be selected', function () {
    element(by.css('.e2eSegmentExistingSegment')).click();
});
it('test should be selected', function () {
    element(by.css('.e2eSegmentTestButton')).click();
});

});
