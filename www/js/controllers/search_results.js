angular.module('toRest.controllers')

  .controller('SearchResultsCtrl',function($scope,$rootScope)  {
    var ko = Math.floor(Math.random() *(20 - 10 + 1) + 10);

    $scope.high_cost = function(cost) {
      var result = (cost/100)*ko + cost*1;
      return Math.floor(result);
    };

  });