angular.module('toRest.controllers')

.controller('SearchCtrl', function($scope,$rootScope,$ionicHistory,$http,$state,$ionicPopup) {

  $scope.range_tourists = _.range(17);
  $scope.tourists_count = {
    "adults": 2,
    "children": 0
  }
  $scope.children_age = [];
  $scope.change_children_count = function() {
    $scope.children_age = [];
    for (var i = 0; i < $scope.tourists_count.children; i++) {
      $scope.children_age.push({"age": 5})
    }
  }

  var validate_search_data = function() {
    var country_origin = $rootScope.search.country_origin.id > -1,
        country_destination = $rootScope.search.country_destination.id > -1,
        city_origin = $rootScope.search.city_origin.id > -1,
        city_destination = $rootScope.search.city_destination.id > -1;

    return (country_destination && country_origin && city_destination && city_origin);
  }

  $scope.process_search = function() {
    if (! validate_search_data()) {
      $rootScope.showAlert('Поиск невозможен','Вы не указали все необходимые параметры поиска');
      return false;
    }

    var tourists = []
    for (var i = 0; i < $scope.tourists_count.adults; i++) {
      tourists.push(18)
    }
    for (var i = 0; i < $scope.tourists_count.children; i++) {
      tourists.push($scope.children_age[i].age*1)
    }
    if (tourists.length < 1) {
      tourists = [0]
    }
    $rootScope.tourists_scope = tourists;
    $rootScope.send_search();
  }

  $http.get($rootScope.baseUrl+'/meals/').
    success(function(data, status, headers, config) {
      $scope.food = data ;
      $scope.food_labels = []; 

      data.forEach(function(item) {
        $scope.food_labels[item.id] = item.name;
      });

      console.log($scope.food_labels)
    }).
    error(function(data, status, headers, config) {
      console.log(data);
    });

  $scope.$watch('search.country_destination.id', function(newValue) {
    if (newValue > -1) {
      loadStars();
    }
  });

  var loadStars = function() {
    $http.get($rootScope.baseUrl+'/countries/'+ $rootScope.search.country_destination.id +'/hotel-stars/').
      success(function(data, status, headers, config) {
        console.log(data);
        $scope.categories = data;
        $scope.category_index = 0;
        $scope.categories.forEach(function(item) {
          item.selected = false;
        });
      }).
      error(function(data, status, headers, config) {
        console.log(data);
      });
  }

  $scope.updateCategories = function(category) {
    if (category.selected) {
      $rootScope.search.category.push(category.id);
    } else {
      $rootScope.search.category.splice($rootScope.search.category.indexOf(category.id), 1);
    }
    console.log($rootScope.search.category);
  }
   
  $scope.chooseFood = function() {
    var myPopup = $ionicPopup.show({
      templateUrl: 'templates/partials/popup_food.html',
      title: '<h4>Выберите питание</h4>',
      scope: $scope,
      buttons: [
        { text: 'Отмена' },
        {
          text: '<b>Ок</b>',
          type: 'button-positive',
        }
      ]
    });
  };

  $scope.startDatePicker = {
    titleLabel: 'Дата вылета: с',
    callback: function (val) {
      DatepickerCallback("start_date", val);
    }
  };

  $scope.endDatePicker = {
    titleLabel: 'Дата вылета: по',
    callback: function (val) {
      DatepickerCallback("end_date", val);
    }
  };

  var DatepickerCallback = function (field, val) {
    if (typeof(val) != 'undefined') {
      $rootScope.search[field] = val;
    }
  };
});