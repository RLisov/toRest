angular.module('toRest.controllers')

  .controller('TouristCtrl', function($scope,$rootScope,$stateParams,$ionicPopup,$ionicHistory) {
    $scope.tourist_id = $stateParams.touristIndex;
    $scope.tourist = $rootScope.reserved.tourists[$stateParams.touristIndex];

    $scope.sexList = [
      { text: "Мужской", value: "m" },
      { text: "Женский", value: "f"}
    ];

    $scope.sexLabel = {
      "m": "Мужской",
      "f": "Женский"
    };

    $scope.saveTourist = function() {
      $rootScope.check_validation();
      $ionicHistory.goBack();
    }

    $scope.chooseMale = function() {
      $scope.sexListChange = function(item) {
        $scope.tourist.gender = item.value;
      };  
             
      var myPopup = $ionicPopup.show({
        templateUrl: 'templates/partials/popup_male.html',
        title: 'Выберите пол',
        scope: $scope,
        buttons: [
          {
            text: '<b>Ok</b>',
            type: 'button-positive',
          }
        ]
      });
    };

    $scope.passportPicker = {
      titleLabel: 'Срок действия паспорта',
      showTodayButton: false,
      setButtonType : 'button-assertive',
      callback: function (val) {
        DatepickerCallback("passport_till", val);
      }
    };

    $scope.birthdayPicker = {
      titleLabel: 'День рождения',
      closeLabel: 'Закрыть',
      showTodayButton: false,
      setButtonType : 'button-assertive',
      callback: function (val) {
        DatepickerCallback("birthday", val);
      }
    };

    var DatepickerCallback = function (field, val) {
      if (typeof(val) != 'undefined') {
        $scope.tourist[field] = val;
      }
    };
  })

  .directive('ionSearch', function() {
    var timer;
    return {
        restrict: 'E',
        replace: true,
        // scope: {
        //     getData: '&source',
        //     model: '=?',
        //     search: '=?filter'
        // },
        link: function(scope, element, attrs) {
            attrs.minLength = attrs.minLength || 0;
            scope.placeholder = attrs.placeholder || '';
            scope.search = {value: ''};

            if (attrs.class)
                element.addClass(attrs.class);

            if (attrs.source) {
                scope.$watch('search.value', function (newValue, oldValue) {
                    if (newValue.length > attrs.minLength) {
                        scope.getData({str: newValue}).then(function (results) {
                            scope.model = results;
                        });
                    } else {
                        scope.model = [];
                    }
                });
            }

            scope.clearSearch = function() {
                scope.search.value = '';
            };
        },
        template: '<div class="item-input-wrapper">' +
                    '<i class="icon ion-search placeholder-icon"></i>' +
                    '<input type="search" placeholder="{{placeholder}}" ng-model="search.value" >' +
                    '<i ng-if="search.value.length > 0" ng-click="clearSearch()" class="icon ion-close-circled placeholder-icon"></i>' +
                  '</div>'
    };
  });