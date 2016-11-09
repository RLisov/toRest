angular.module('toRest.controllers')

  .controller('CountryCtrl', function($scope,$http,$rootScope,$ionicHistory,$state,$stateParams,$ionicLoading) {
    $ionicLoading.show({
      noBackdrop: false
    });

    var urlPoint = '';

    switch ($state.current.name) {
      case 'countryOrigin':
        urlPoint = '/countries/origin/';
        break
      case 'countryDestination':
        urlPoint = '/cities/origin/' + $rootScope.search.city_origin.id + '/destinations/countries';
        break
      case 'citizenship':
        urlPoint = '/countries/origin/';
        break
    }

    $http.get($rootScope.baseUrl+urlPoint).
      success(function(data, status, headers, config) {
        $ionicLoading.hide();
        $scope.countries = data; 
      }).
      error(function(data, status, headers, config) {
        $ionicLoading.hide();
        $rootScope.showAlert('Неудачно!', 'Ошибка загрузки');
      });

    $scope.chooseCountry = function(country) {
      switch ($state.current.name) {
        case 'countryOrigin':
          $rootScope.search.country_origin = country;
          $rootScope.search.city_origin = {
            "name": "Выберите город отправления",
            "id": -1
          };
          $rootScope.search.country_destination =
          {
            "name": "Выберите страну назначения",
            "id": -1
          };
          $rootScope.search.city_destination = {
            "name": "Выберите город назначения",
            "id": -1
          };
          break
        case 'countryDestination':
          $rootScope.search.country_destination = country;
          $rootScope.search.city_destination = $rootScope.reset_search.city_destination;
          break
        case 'citizenship':
          $rootScope.reserved.tourists[$stateParams.touristIndex].citizenship = country;
          break
      }
      $ionicHistory.goBack();
    };    

    $scope.rate = 3;
    $scope.max = 5;
  });