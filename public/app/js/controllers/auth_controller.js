

angular.module('traderplatform').controller('AuthController',
  ['$scope', '$location', '$cookies', 'User', 'Shared', 'Auth',
  function($scope, $location, $cookies, User, Shared, Auth){

  // 'use strict';

  // console.log('AuthController init', $location);

  // $scope.login = function(user_info){
  //   console.log(user_info); // This is approprately passing username and password
  //   auth.login(user_info).$promise.then(function(data){
  //     console.log(data);
  //   });
  // };

  // $scope.signup = function(user_info){
  //   User.post(user_info).$promise.then(
  //     function(data){
  //       if(data instanceof Array){
  //         document.getElementsByClassName('initiallyHidden').className.replace(/\binitiallyHidden\b/, '')
  //       }
  //       else{
  //         console.log(data);
  //         $cookies.put('token', data._id);
  //         $location.path('/#/routerUsers/profile').replace();
  //       }
  //     }
  //   );
  // };

}]);
