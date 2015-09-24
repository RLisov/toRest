angular.module('toRest.controllers', [])

	.controller('SearchCtrl', function($scope,$rootScope,$ionicHistory,$http,$state) {
	  $scope.rate = 3;
	  $scope.max = 5;
    $scope.send_search = function() {
      var data = $rootScope.search;
      $rootScope.tour = {};
      $http.post('http://onholidays.workplay.in/api/search/', data).
        success(function(data, status, headers, config) {
          $rootScope.tour = data ;
          /*console.log($rootScope.tour);
          console.log(status);*/
          $state.go('search_results');
        }).
        error(function(data, status, headers, config) {
          alert(data);
        });
    };
  })

  .controller('SearchResultsCtrl',function($scope,$rootScope)  {
    $scope.rate = 3;
    $scope.max = 5;
    console.log ($rootScope.tour.data[0].pictures[0]);
  })

	.controller('FavouritesCtrl', function($scope) {
	  $scope.rate = 3;
	  $scope.max = 5;
	})

  .controller('CountryCtrl', function($scope,$http,$rootScope,$ionicHistory) {
    $http.get('http://onholidays.workplay.in/api/countries/').
      success(function(data, status, headers, config) {
        $scope.countries = data ; 
        console.log($scope.countries);
      }).
      error(function(data, status, headers, config) {
    });

    $http.get('http://onholidays.workplay.in/api/cities/').
      success(function(data, status, headers, config) {
         // $scope.countries = $scope.countries.concat(data);
        $scope.cities = data ; 
      }).
      error(function(data, status, headers, config) {
    });

    $scope.chooseCountry = function(country) {
      $rootScope.search.country_destination = country;
      $rootScope.$apply();
      $ionicHistory.goBack();
    };

    $scope.chooseCity = function(city) {
      $rootScope.search.city_destination = city;
      $rootScope.$apply();
      $ionicHistory.goBack();
    };

    $scope.rate = 3;
    $scope.max = 5;
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
	  }

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