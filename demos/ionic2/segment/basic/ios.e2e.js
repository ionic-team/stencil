describe('segment/basic: ios', function() {

it('should init', function() {
  browser.get('http://localhost:8876/dist/e2e/segment/basic/index.html?ionicplatform=ios&ionicOverlayCreatedDiff=0&ionicanimate=false&snapshot=true');
});

"use strict";
it('friends and standard should be selected', function () {
    element(by.css('.e2eSegmentFriends')).click();
    element(by.css('.e2eSegmentStandard')).click();
});
it('model c and top grossing should be selected', function () {
    element(by.css('.e2eSegmentModelC')).click();
    element(by.css('.e2eSegmentTopGrossing')).click();
});

});
