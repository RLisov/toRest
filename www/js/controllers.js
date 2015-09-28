angular.module('toRest.controllers', [])

	.controller('SearchCtrl', function($scope,$rootScope,$ionicHistory,$http,$state,$ionicPopup) {
	  $scope.rate = 3;
	  $scope.max = 5;

    $scope.send_search = function() {
      var data = {
        country_origin : $rootScope.search.country_origin.id,          //индекс страны из базы
        city_origin: $rootScope.search.city_origin.id,              //индекс города из базы
        country_destination : $rootScope.search.country_destination.id,          //индекс страны из базы
        city_destination: $rootScope.search.city_destination.id,              //индекс города из базы
        start_date : $rootScope.search.start_date,      //дата заезда от и
        end_date : $rootScope.search.end_date,        // до
        minDays : $rootScope.search.minDays,
        maxDays : $rootScope.search.maxDays,
        tourists :              //количество туристов
        [
            18           //0..18
        ],
        minCost : $rootScope.search.minCost,
        maxCost : $rootScope.search.maxCost,             //максимальная цена
        category : $rootScope.search.category ,        //уровень отеля, звезды, количество звёзд не ниже чем
        food : 2              //качество питания - индекс из базы
      }

     
      $rootScope.tour = {};
     
      $http.post($rootScope.baseUrl+'/search/', data).
        success(function(data, status, headers, config) {
          $rootScope.tour = data ;
          console.log($rootScope.tour);
          console.log(status);
          $state.go('search_results');
        }).
        error(function(data, status, headers, config) {
          console.log(data);
        });
    };

    $http.get($rootScope.baseUrl+'/food/').
      success(function(data, status, headers, config) {
          $rootScope.food = data ;
          
        }).
        error(function(data, status, headers, config) {
          console.log(data);
    });

     $scope.chooseFood = function() {
      
      $scope.foodListChange = function(item) {
        console.log("Selected Serverside, text:", item.name, "value:", item.id);
      };  
             
      var myPopup = $ionicPopup.show({
        templateUrl: 'templates/popup_food.html',
        title: 'Choose your male',
        subTitle: 'Please use normal things',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Ok</b>',
            type: 'button-positive',
          }
        ]
      });

      myPopup.then(function(item) {
        console.log('Tapped!', item);
      });
    };
    // console.log($rootScope.search.country_origin.id);

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
    
  })

	.controller('FavouritesCtrl', function($scope) {
	  $scope.rate = 3;
	  $scope.max = 5;
	})

  .controller('CountryCtrl', function($scope,$http,$rootScope,$ionicHistory,$state) {
    $http.get('http://onholidays.workplay.in/api/countries/').
      success(function(data, status, headers, config) {
        $scope.countries = data ; 
        console.log($scope.countries);
      }).
      error(function(data, status, headers, config) {
    });

    $scope.chooseCountry = function(country) {
      // var countryToChange;
      console.log($state.current.name);
      if ($state.current.name == 'countryOrigin') {
        $rootScope.search.country_origin = country;
      } else {
        $rootScope.search.country_destination = country;
      }
      console.log($rootScope.search);
      // countryToChange = country; 
      $ionicHistory.goBack();
    };    

    $scope.rate = 3;
    $scope.max = 5;
  })

  .controller('CitiesCtrl', function($scope,$http,$rootScope,$ionicHistory,$state){
    var countryId = ($state.current.name == 'cityOrigin') ? $rootScope.search.country_origin.id : $rootScope.search.country_destination.id
    $http.get('http://onholidays.workplay.in/api/cities/', {params: {country:countryId}}).
      success(function(data, status, headers, config) {
         // $scope.countries = $scope.countries.concat(data);
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

	.controller('TourpageCtrl', function($scope,$timeout, $ionicSlideBoxDelegate,$ionicLoading, $compile) {
	  $scope.rate = 3;
	  $scope.max = 5;
	  $scope.choice = "A";
	  $scope.tabIndex = 0;
	  
    //google initialize

    $scope.map;
        $scope.markers = [];
        $scope.markerId = 1;

        //Map initialization  
        $timeout(function(){

            var latlng = new google.maps.LatLng(35.7042995, 139.7597564);
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

	  $scope.gallerySlider = function(index) {
	  	// $ionicSlideBoxDelegate.$getByHandle('gallery').slide($index);
	  	console.log('index gallerry', index);
	  }
    
   
	})

	
	.controller('ReservedCtrl', function($scope,$rootScope, $cordovaDialogs,$ionicPlatform,$ionicPopup) {

    $scope.chooseMale = function() {
      $scope.sexList = [
        { text: "male", value: "m" },
        { text: "female", value: "f"}
      ];

      $scope.sexListChange = function(item) {
        console.log("Selected Serverside, text:", item.text, "value:", item.value);
      };  
             
      var myPopup = $ionicPopup.show({
        templateUrl: 'templates/popup_male.html',
        title: 'Choose your male',
        subTitle: 'Please use normal things',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Ok</b>',
            type: 'button-positive',
          }
        ]
      });

      myPopup.then(function(res) {
        console.log('Tapped!', res);
        $rootScope.reserved.male = res;
      });
    };

    $scope.nameInput = function() { 
         $cordovaDialogs.prompt('Введите имя', 'title', ['Cancel','Ok'], '')
          .then(function(result) {
            var input = result.input1;
            console.log("input",input);
            // no button = 0, 'OK' = 1, 'Cancel' = 2
            var btnIndex = result.buttonIndex;

          });
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
        DatepickerCallback(val);
      }
    };


    var DatepickerCallback = function (val) {
      if (typeof(val) === 'undefined') {
        
      } else {
        console.log(val);
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