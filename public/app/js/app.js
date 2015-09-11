'use strict';

/* App Module */

angular.module('traderplatform', ['ngResource', 'ngRoute', 'ngMessages', 'ngCookies', 'ui.bootstrap', 'ngAnimate']);

angular.module('traderplatform'). config(['$routeProvider',function($routeProvider) {

    $routeProvider.when('/strategy_list', {
      templateUrl: 'app/partials/strategy_list/strategy_list.html',
      controller: 'StrategyListController'
    });

    $routeProvider.when('/strategy/:id', {
      templateUrl: 'app/partials/strategy/strategy.html',
      controller: 'StrategyController'
    });

    // Do we really need a list of all routerUsers page?
    $routeProvider.when('/routerUsers', {
      templateUrl: 'app/partials/user-list.html',
      controller: 'UserController'
    });

    $routeProvider.when('/search', {
      templateUrl: 'app/partials/search/search-results.html',
      controller: 'SearchController'
    });

    $routeProvider.when('/user/profile', {
      templateUrl: 'app/partials/users/profile.html',
      controller: 'ProfileController'
    })

    $routeProvider.when('/login', {
      templateUrl: 'app/partials/auth/login.html',
      controller: 'AuthController' // This might need to be user controller instead or might just make things easier
    })

    $routeProvider.when('/signup', {
      templateUrl: 'app/partials/auth/signup.html',
      controller: 'AuthController'
    })

    $routeProvider.when('/suggest', {
      templateUrl: 'app/partials/users/suggest.html',
      controller: 'AuthController' // This might need to be user controller instead or might just make things easier
    })

    $routeProvider.when('/downloads', {
      templateUrl: 'app/partials/users/downloads.html',
      controller: 'AuthController' // This might need to be user controller instead or might just make things easier
    })

    $routeProvider.when('/aboutus', {
      templateUrl: 'app/partials/users/aboutus.html',
      controller: 'AuthController' // This might need to be user controller instead or might just make things easier
    })

    $routeProvider.when('/getstarted', {
      templateUrl: 'app/partials/users/getstarted.html',
      controller: 'AuthController' // This might need to be user controller instead or might just make things easier
    })

    $routeProvider.otherwise({redirectTo: '/strategy_list'});

}]);

