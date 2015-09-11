// var app = angular.module('traderplatform', ['ngRoute', 'ngMaterial']);
'use strict';

angular.module('traderplatform').controller('traderplatform', ['$scope', '$location', 'Shared','SearchItem',
    function($scope, $location, Shared, SearchItem) {

    $scope.isKeyEventEnter = function(event){
      return event.keyCode == 13;
    }

  }]);


  // angular.module('traderplatform').config( function($mdThemingProvider){
  //   // Configure a dark theme with primary foreground yellow
  //   $mdThemingProvider.theme('docs-dark', 'default')
  //       .primaryPalette('green')
  //       .dark();
  // });
