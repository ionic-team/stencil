
  var inputTypeMap = {
    'ion-toggle': 'checkbox'
  }

  var myPre;

  var inputDirective = ['$browser', '$sniffer', '$filter', '$parse', function($browser, $sniffer, $filter, $parse) {
    return {
      restrict: 'E',
      require: ['?ngModel'],
      link: {
        pre: function(scope, element, attr, ctrls) {
          attr.type = inputTypeMap[element[0].tagName.toLowerCase()];
          myPre(scope, element, attr, ctrls);
        }
      }
    };
  }];

  angular.module('app', ['directives'])

  angular.module('directives', [])

  .config(function($provide) {
      $provide.decorator('inputDirective', function($delegate) {
          var directive = $delegate[0];
          myPre = directive.link.pre;
          return $delegate;
      });
  })

  .directive({
      ionToggle: inputDirective
  });