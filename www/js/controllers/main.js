angular.module('toRest.controllers')
.controller('MainCtrl', function($scope,$rootScope,$http,$state) {

  $http.get($rootScope.baseUrl+'/search_masks/').
    success(function(data, status, headers, config) {
      set_search_masks(data);
    }).
    error(function(data, status, headers, config) {
      $http.get('js/search_masks.json').
        success(function(data, status, headers, config) {
          set_search_masks(data);
        });
    });

  function set_search_masks(data) {
    $scope.search_masks = data;
    console.log($scope.search_masks);
  }

  $scope.search_mask = function(mask) {
    $rootScope.tourists_scope = [18,18]
    for(key in mask.mask){
        $rootScope.search[key] = mask.mask[key]
    }
    $rootScope.search.city_destination = {
      "id": -1
    }
    $rootScope.send_search();
  }

  $scope.new_search = function() {
    $rootScope.search = angular.copy($rootScope.reset_search);
    console.log($rootScope.search);
    $state.go('search');
  }
  
});