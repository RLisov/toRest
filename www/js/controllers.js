angular.module('toRest.controllers', [])

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
    
  })

	.controller('SearchCtrl', function($scope,$rootScope,$ionicHistory,$http,$state,$ionicPopup) {
    $scope.range_tourists = _.range(17);
    $scope.tourists_count = {
      "adults": 0,
      "children": 0
    }
    $scope.children_age = [];
    $scope.change_children_count = function() {
      $scope.children_age = [];
      for (var i = 0; i < $scope.tourists_count.children; i++) {
        $scope.children_age.push({"age": 5})
      }
    }

    $scope.process_search = function() {
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

    $http.get($rootScope.baseUrl+'/food/').
      success(function(data, status, headers, config) {
        $scope.food = data ;
        $scope.food_labels = data.map(function(item) {
          return item.name
        })
        console.log($scope.food_labels)
      }).
      error(function(data, status, headers, config) {
        console.log(data);
      });

     
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
  })

  .controller('SearchResultsCtrl',function($scope,$rootScope)  {
    var ko = Math.floor(Math.random() *(20 - 10 + 1) + 10); 

    $scope.high_cost = function(cost) {
      var result = (cost/100)*ko + cost*1;
      return Math.floor(result);
    };

  })

  .controller('CountryCtrl', function($scope,$http,$rootScope,$ionicHistory,$state,$stateParams,$ionicLoading) {
    $ionicLoading.show({
      noBackdrop: false
    });
    $http.get($rootScope.baseUrl+'/countries/').
      success(function(data, status, headers, config) {
        $ionicLoading.hide();
        $scope.countries = data; 
      }).
      error(function(data, status, headers, config) {
        $rootScope.showAlert('Неудачно!', 'Ошибка загрузки');
    });

    $scope.chooseCountry = function(country) {
      switch ($state.current.name) {
        case 'countryOrigin':
          $rootScope.search.country_origin = country;
          $rootScope.search.city_origin = $rootScope.reset_search.city_origin;
          break
        case 'countryDestination':
          $rootScope.search.country_destination = country;
          $rootScope.search.city_destination = $rootScope.reset_search.city_destination;
          break
        case 'citizenship':
          $rootScope.reserved.tourists[$stateParams.touristIndex].citizenship = country;
      }
      $ionicHistory.goBack();
    };    

    $scope.rate = 3;
    $scope.max = 5;
  })

  .controller('CitiesCtrl', function($scope,$http,$rootScope,$ionicHistory,$state,$ionicLoading){
    $ionicLoading.show({
      noBackdrop: false
    });
    var countryId = ($state.current.name == 'cityOrigin') ? $rootScope.search.country_origin.id : $rootScope.search.country_destination.id
    $http.get($rootScope.baseUrl+'/cities/', {params: {country:countryId}}).
      success(function(data, status, headers, config) {
        $ionicLoading.hide();
        $scope.cities = data ;
        console.log($scope.cities) 
      }).
      error(function(data, status, headers, config) {
        $rootScope.showAlert('Неудачно!', 'Ошибка загрузки');
    });

    $scope.chooseCity = function(city) {
      // var countryToChange;
      console.log($state.current.name);
      if ($state.current.name == 'cityOrigin') {
        $rootScope.search.city_origin = city;
      } else {
        $rootScope.search.city_destination = city;
      }
      console.log($rootScope.search);
      // countryToChange = country; 
      $ionicHistory.goBack();
    }; 

  })   

	.controller('TourpageCtrl', function($scope,$timeout,$ionicSlideBoxDelegate,$stateParams,$rootScope,$state) {
	  $scope.max = 5;
	  $scope.choice = null;
	  $scope.tabIndex = 0;
    var tour_id = $stateParams.tourId;
    $scope.tour = $rootScope.tours.data[tour_id];
    $scope.arrive_date = $rootScope.get_arrive_date($scope.tour.date, $scope.tour.duration)
    console.log($scope.tour);
    $rootScope.reserved = {};
    $rootScope.reserved.technical_info = $scope.tour.technical_info;
    $rootScope.reserved.tourists = $rootScope.tourists_scope.map(function(age) {
      return {
        "age": age
      }
    })

    $scope.setChoice = function(variant) {
      $rootScope.reserved.choice = variant;
    };

    $scope.go_reserved = function() {
      if ($rootScope.reserved.choice) {
        $state.go('reserved',
          {tourId: tour_id}
        );  
      } else {
        $rootScope.showAlert('Ошибка бронирования','Сначала выберите вариант размещения выше');
      }
    }
	  
    //google initialize
    $scope.map;
    //Map initialization  
    $timeout(function(){
        var latlng = new google.maps.LatLng($scope.tour.general.position.lat || 0, $scope.tour.general.position.lon || 0);
        var myOptions = {
            zoom: 8,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        $scope.map = new google.maps.Map(document.getElementById("map_canvas"), myOptions); 
        $scope.overlay = new google.maps.OverlayView();
        $scope.overlay.draw = function() {}; // empty function required
        $scope.overlay.setMap($scope.map);
        $scope.element = document.getElementById('map_canvas');
    },100);


    $timeout(function() {
      $ionicSlideBoxDelegate.$getByHandle('main-tabs').enableSlide(false);
    }, 10);
    

	  $scope.makeFooterVisible = function(index) {
	  	$scope.tabIndex = index;
	  	console.log($scope.tabIndex);
	  };

    $scope.searchGoogle = function(request) {
      window.open('https://www.google.ru/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#newwindow=1&safe=off&q='+request,'_system','location=no');
    }
	})

	
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
        "technical_info": $rootScope.reserved.technical_info,
        "choice": $rootScope.reserved.choice,
        "tourists": $rootScope.reserved.tourists.map(function(tourist) {
          tourist.citizenship = tourist.citizenship.id;
          tourist.birthday = $rootScope.format_date(tourist.birthday);
          tourist.passport_till = $rootScope.format_date(tourist.passport_till);
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
	})

  .controller('TouristCtrl', function($scope,$rootScope,$stateParams,$ionicPopup,$ionicHistory) {
    $scope.tourist_id = $stateParams.touristIndex;
    $scope.tourist = $rootScope.reserved.tourists[$stateParams.touristIndex];

    $scope.sexList = [
      { text: "Мужской", value: "male" },
      { text: "Женский", value: "female"}
    ];

    $scope.sexLabel = {
      "male": "Мужской",
      "female": "Женский"
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