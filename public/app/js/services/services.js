  angular.module('traderplatform').factory('User', ['$resource', function($resource){
  return $resource('/api/user/:id', {id: '@_id'},
  {
    query: {method:'GET', isArray:true},
    getOne: {method:'GET', isArray:false},
    post: {method:'POST'},
    update: {method:'PUT' },
    remove: {method:'DELETE'}
  });
}]);


angular.module('traderplatform').factory('Shared', [function($resource){
    return {};
}]);

angular.module('traderplatform').factory('Strategy', ['$resource', function($resource){
  return $resource('/api/user/:userId/strategy/:id', {id: '@_id', userId: '@userId'}, {
    query: {method:'GET', isArray:true},
    getOne: {method:'GET', isArray:false},
    post: {method:'POST'},
    update: {method:'PUT' },
    remove: {method:'DELETE'}
  });
}]);

angular.module('traderplatform').factory('HistoricalData', ['$resource', 'Shared', function($resource){
  var HistoricalData = $resource('/api/historicaldata/', {}, {
    query: {method:'GET', isArray:true},
    getOne: {method:'GET', isArray:false},
    post: {method:'POST'},
    update: {method:'PUT'},
    remove: {method:'DELETE'}
  });

  return HistoricalData;
}]);

angular.module('traderplatform').factory('SearchItem', ['$resource', function($resource){
  SearchItem = $resource('/api/search/routerUsers/:id', {id: '@_id'}, {
    query: {method:'GET', isArray:true},
    getOne: {method:'GET', isArray:false},
    post: {method:'POST'},
    update: {method:'PUT' },
    remove: {method:'DELETE'}
  });
  return SearchItem;
}]);

angular.module('traderplatform').factory('Auth', ['$resource', function($resource){
  return $resource('/auth/current', {},  {
    login: {method:'GET'}
  });
}]);

