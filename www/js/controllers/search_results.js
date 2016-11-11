angular.module('toRest.controllers')

  .controller('SearchResultsCtrl',function($scope, $rootScope, $http)  {
    var ko = Math.floor(Math.random() *(20 - 10 + 1) + 10),
        category_map = {
          '1*': 1,
          '2*': 2,
          '3*': 3,
          '4*': 4,
          '5*': 5,
          'Apts': 'Аппартаменты',
          'Villas': 'Вилла'
        }

    $scope.cities = {};
    $scope.tours = [];
    $scope.loading = true;

    $http.get($rootScope.baseUrl+'/request/' + $rootScope.requestId + '/results/').
      success(function(data, status, headers, config) {
        $scope.tours = data;

        $scope.tours = $scope.tours.filter(function(tour) {
          return tour.hotel_id > 0;
        })      

        $scope.tours.forEach(function(tour) {
          tour.general.stars = category_map[tour.general.category];
        });

        $http.get($rootScope.baseUrl + '/countries/' + $scope.tours[0].general.country + '/cities/').
          success(function(data, status, headers, config) {
            data.forEach(function(city) {
              $scope.cities[city.id] = city.name;
            });
            $scope.loading = false;
          }).
          error(function(data, status, headers, config) {
            $rootScope.showAlert('Неудачно!', 'Ошибка загрузки');
        });
      }).
      error(function(data, status, headers, config) {
        $rootScope.showAlert('Неудачно!','Ошибка в ответе сервера');
        console.log(data);
      });

    $scope.high_cost = function(cost) {
      var result = (cost/100)*ko + cost*1;
      return Math.floor(result);
    };

  });