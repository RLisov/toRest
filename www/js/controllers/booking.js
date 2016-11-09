angular.module('toRest.controllers')
  
  .controller('ReservedCtrl', function($scope,$rootScope,$stateParams,$ionicPopup,$http,$ionicLoading,$state,$ionicHistory) {
    console.log($rootScope.reserved);
    $scope.tour = $rootScope.tours.data[$stateParams.tourId];
    $scope.arrive_date = $rootScope.get_arrive_date($scope.tour.date, $scope.tour.duration)

    $scope.age_label = function(age) {
      return age > 17 ? "Турист" : "Ребёнок"
    }

    $scope.tourist_name = function(tourist) {
      if (tourist.first_name && tourist.last_name) {
        return tourist.first_name + ' ' + tourist.last_name
      } else {
        return false;
      }
    }

    $scope.start_reserved = function() {
      $rootScope.reserved.contact = {};
      $scope.contact = $rootScope.reserved.contact;
      $scope.contact_error = false;
             
      var myPopup = $ionicPopup.show({
        templateUrl: 'templates/partials/popup_reserve.html',
        title: 'Укажите контактные данные для связи',
        scope: $scope,
        buttons: [
          {
            text: '<b>Завершить бронирование</b>',
            type: 'button-positive',
            onTap: function(e) {
              console.log($rootScope.reserved.contact);
              if (!$scope.contact.email || !$scope.contact.phone || !$scope.contact.name) {
                e.preventDefault();
                $scope.contact_error = true;
              } else {
                $scope.contact_error = false;
                $scope.process_reserved();
                return true;
              }
            }
          }
        ]
      });
    };

    $scope.process_reserved = function() {
      $ionicLoading.show({
        noBackdrop: false
      });
      var data = {
        "technical_info": $rootScope.reserved.choice.technical_info,
        "tourists": $rootScope.reserved.tourists.map(function(tourist) {
          tourist.citizenship = tourist.citizenship.id;
          tourist.birthday = $rootScope.format_date(tourist.birthday);
          tourist.passport_till = $rootScope.format_date(tourist.passport_till);
          delete tourist.age
          return tourist
        })
      }
      console.log(data);
      $http.post($rootScope.baseUrl+'/book/', data).
        success(function(response, status, headers, config) {
          $ionicLoading.hide();
          if (response.status == "fail") {
            $rootScope.showAlert('Неудачно!',response.data.text);
            $ionicHistory.nextViewOptions({
              disableBack: true
            });
            $state.go('home');
          } else {
            $rootScope.showAlert('Бронирование завершено!','Наш менеджер обработает ваш заказ и свяжется с вами');  
            $ionicHistory.nextViewOptions({
              disableBack: true
            });
            $state.go('home', {location: 'replace'});
          }
          console.log(data);
        }).
        error(function(data, status, headers, config) {
          $ionicLoading.hide();
          $rootScope.showAlert('Неудачно!','Ошибка в ответе сервера');
          console.log(data);
        })

    }

    var fields = ["citizenship", "gender", "first_name", "last_name", "passport_serial", "passport_number", "passport_till", "birthday"]
    $rootScope.tourists_invalid = function() {
      var valid = true;
      $rootScope.reserved.tourists.forEach(function(tourist) {
        valid = valid && fields.every(function(field) {
          return tourist[field];
        })
      });
      return !valid
    }
  });