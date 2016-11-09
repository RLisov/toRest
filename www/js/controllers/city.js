angular.module('toRest.controllers')

  .controller('CitiesCtrl', function($scope,$http,$rootScope,$ionicHistory,$state,$ionicLoading){
    $ionicLoading.show({
      noBackdrop: false
    });
    
    var urlPoint = '';

    switch ($state.current.name) {
      case 'cityOrigin':
        urlPoint = '/cities/origin/?country=' + $rootScope.search.country_origin.id;
        break
      case 'cityDestination':
        urlPoint = '/countries/' + $rootScope.search.country_destination.id + '/cities/';
        break
    }

    $http.get($rootScope.baseUrl+urlPoint).
      success(function(data, status, headers, config) {
        $ionicLoading.hide();
        $scope.cities = data ;
        console.log($scope.cities) 
      }).
      error(function(data, status, headers, config) {
        $ionicLoading.hide();
        $rootScope.showAlert('Неудачно!', 'Ошибка загрузки');
    });

    $scope.chooseCity = function(city) {
      
      console.log($state.current.name);
      if ($state.current.name == 'cityOrigin') {
        $rootScope.search.city_origin = city;
      } else {
        $rootScope.search.city_destination = city;
      }
      
      $ionicHistory.goBack();
    }; 

  });