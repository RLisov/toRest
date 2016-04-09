angular.module('toRest.controllers', [])

	.controller('SearchCtrl', function($scope,$rootScope,$ionicHistory,$http,$state,$ionicPopup,$filter,$ionicLoading) {
	  $scope.rate = 3;
	  $scope.max = 5;

    $scope.send_search = function() {
      $ionicLoading.show({
        showBackdrop: false
      });
      // var data = {
      //   country_origin : 4,          
      //   city_origin: 1104,              
      //   country_destination : 6,          
      //   city_destination: -1,              
      //   start_date : $scope.format_date($rootScope.search.start_date),
      //   end_date : $scope.format_date($rootScope.search.end_date),        
      //   minDays : $rootScope.search.minDays*1,
      //   maxDays : $rootScope.search.maxDays*1,
      //   tourists :             
      //   [
      //       18           
      //   ],
      //   minCost : $rootScope.search.minCost*1,
      //   maxCost : $rootScope.search.maxCost*1,             
      //   category : $rootScope.search.category*1 ,        
      //   food : 2              
      // };

      var data = {
        country_origin : $rootScope.search.country_origin.id,          
        city_origin: $rootScope.search.city_origin.id,              
        country_destination : $rootScope.search.country_destination.id,          
        city_destination: $rootScope.search.city_destination.id,              
        start_date : $scope.format_date($rootScope.search.start_date),      
        end_date : $scope.format_date($rootScope.search.end_date),        
        minDays : $rootScope.search.minDays*1,
        maxDays : $rootScope.search.maxDays*1,
        tourists :             
        [
          18           
        ],
        minCost : $rootScope.search.minCost*1,
        maxCost : $rootScope.search.maxCost*1,             
        category : $rootScope.search.category*1 ,        
        food : 2              
      }

     
      $rootScope.tours = {};
      console.log(data);

      $http.post($rootScope.baseUrl+'/search/', data).
        success(function(data, status, headers, config) {
          $ionicLoading.hide();
          $rootScope.tours = data;
          console.log($rootScope.tours);
          console.log(status);
          if ($rootScope.tours.status != 'fail') {
            $state.go('search_results');
          } else {
            $rootScope.showAlert('Неудачно!', $rootScope.tours.data.text);
          }
        }).
        error(function(data, status, headers, config) {
          $rootScope.showAlert('Неудачно!','Ошибка в ответе сервера');
          console.log(data);
        });
    };

    $http.get($rootScope.baseUrl+'/food/').
    success(function(data, status, headers, config) {
      $rootScope.food = data ;
      console.log($rootScope.food);
    }).
    error(function(data, status, headers, config) {
      console.log(data);
    });

     
    $scope.chooseFood = function() {
      var myPopup = $ionicPopup.show({
        templateUrl: 'templates/popup_food.html',
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

      myPopup.then(function(item) {
        console.log($scope.search);
        console.log("picked "+item);
      });
    };
    
    $scope.format_date = function(date) {
      console.log(date);
      var curr_date = date.getDate();
      var curr_month = date.getMonth();
      var curr_year = date.getFullYear();
      return (('0' + curr_date).slice(-2))+"."+(('0'+(curr_month*1+1)).slice(-2)) + "." + curr_year ;
    };

    $scope.startDateObject = {
      titleLabel: 'Дата вылета: с',
      closeLabel: 'Закрыть',
      showTodayButton: 'false',
      setLabel: 'Выбрать',
      errorMsgLabel : 'Выберите дату',
      setButtonType : 'button-assertive',
      mondayFirst: true,
      callback: function (val) {
        $rootScope.search.start_date = val;
      }
    };

    $scope.endDateObject = {
      titleLabel: 'Дата вылета: по',
      closeLabel: 'Закрыть',
      showTodayButton: 'false',
      setLabel: 'Выбрать',
      errorMsgLabel : 'Выберите дату',
      setButtonType : 'button-assertive',
      mondayFirst: true,
      callback: function (val) {
        $rootScope.search.end_date = val;
      }
    };
  })

  .controller('SearchResultsCtrl',function($scope,$rootScope)  {
    $scope.rate = 3;
    $scope.max = 5;

    
    var ko = Math.floor(Math.random() *(20-10 + 1) + 10); 

    $scope.high_cost = function(cost) {
      var result = (cost/100)*ko + cost*1;
      return Math.floor(result);
    };

  })

	.controller('FavouritesCtrl', function($scope) {
	  $scope.rate = 3;
	  $scope.max = 5;
	})

  .controller('CountryCtrl', function($scope,$http,$rootScope,$ionicHistory,$state) {
    $http.get($rootScope.baseUrl+'/countries/').
      success(function(data, status, headers, config) {
        $scope.countries = data ; 
        console.log($scope.countries);
      }).
      error(function(data, status, headers, config) {
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
          $rootScope.reserved.citizenship = country;
      }
      $ionicHistory.goBack();
    };    

    $scope.rate = 3;
    $scope.max = 5;
  })

  .controller('CitiesCtrl', function($scope,$http,$rootScope,$ionicHistory,$state){
    var countryId = ($state.current.name == 'cityOrigin') ? $rootScope.search.country_origin.id : $rootScope.search.country_destination.id
    $http.get($rootScope.baseUrl+'/cities/', {params: {country:countryId}}).
      success(function(data, status, headers, config) {
        $scope.cities = data ;
        console.log($scope.cities) 
      }).
      error(function(data, status, headers, config) {
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

	.controller('TourpageCtrl', function($scope,$timeout, $ionicSlideBoxDelegate,$ionicLoading, $compile,$stateParams,$rootScope) {
	  $scope.rate = 3;
	  $scope.max = 5;
	  $scope.choice = "A";
	  $scope.tabIndex = 0;
    $scope.tour = $rootScope.tours.data[$stateParams.tourId];
    console.log($scope.tour);

    $scope.startDateObject = {
      titleLabel: 'Дата вылета: с',
      closeLabel: 'Закрыть',
      showTodayButton: 'false',
      setLabel: 'Выбрать',
      errorMsgLabel : 'Выберите дату',
      setButtonType : 'button-assertive',
      mondayFirst: true,
      callback: function (val) {
        $rootScope.search.start_date = val;
      }
    };
	  
    //google initialize
    $scope.map;
    console.error('MAP!');
    //Map initialization  
    $timeout(function(){
        var latlng = new google.maps.LatLng(35.7042995, 139.7597564);
        var myOptions = {
            zoom: 8,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        $scope.map = new google.maps.Map(document.getElementById("map_canvas"), myOptions); 
        console.error('MAP: ',$scope.map);
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

	
	.controller('ReservedCtrl', function($scope,$rootScope, $cordovaDialogs,$ionicPlatform,$ionicPopup) {

    $scope.sexList = [
      { text: "Мужской", value: "male" },
      { text: "Женский", value: "female"}
    ];

    $scope.sexLabel = {
      "male": "Мужской",
      "female": "Женский"
    };

    $scope.chooseMale = function() {
      $scope.sexListChange = function(item) {
        $rootScope.reserved.male = item.value;
      };  
             
      var myPopup = $ionicPopup.show({
        templateUrl: 'templates/popup_male.html',
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

    $scope.passportTillObject = {
      titleLabel: 'Срок действия паспорта',
      closeLabel: 'Закрыть',
      showTodayButton: 'false',
      setLabel: 'Выбрать',
      errorMsgLabel : 'Выберите дату',
      setButtonType : 'button-assertive',
      mondayFirst: true,
      callback: function (val) {
        DatepickerCallback("passport_till", val);
      }
    };

	  $scope.birthdayDateObject = {
      titleLabel: 'День рождения',
      closeLabel: 'Закрыть',
      showTodayButton: 'false',
      setLabel: 'Выбрать',
      errorMsgLabel : 'Выберите дату',
      setButtonType : 'button-assertive',
      mondayFirst: true,
      callback: function (val) {
        DatepickerCallback("birthday", val);
      }
    };

    var DatepickerCallback = function (field, val) {
      if (typeof(val) != 'undefined') {
        $rootScope.reserved[field] = val;
      }
    };

	})

	.controller('MainCtrl', function($scope) {
	  $scope.rate = 3;
	  $scope.max = 5;
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