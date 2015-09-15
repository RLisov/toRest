angular.module('toRest.controllers', [])

	.controller('SearchCtrl', function($scope,$rootScope,$ionicHistory,$http,$state) {
	  $scope.rate = 3;
	  $scope.max = 5;

    //Datepicker
    var picked_date = new Date();

    $scope.start_dateObject = {
      titleLabel: 'Title',  //Optional
      todayLabel: 'Today',  //Optional
      closeLabel: 'Close',  //Optional
      setLabel: 'Set',  //Optional
      errorMsgLabel : 'Please select time.',    //Optional
      setButtonType : 'button-assertive',  //Optional
      inputDate: picked_date,    //Optional
      mondayFirst: true,    //Optional
      disabledDates:disabledDates,  //Optional
      from: new Date(1920, 7, 2),   //Optional
      to: new Date(2015, 12, 29),    //Optional
      callback: function (val) {    //Mandatory
        datePickerCallback(val);
      }
    };

    



    var disabledDates = [
      new Date(1437719836326),
      new Date(),
      new Date(2015, 7, 10), //months are 0-based, this is August, 10th!
      new Date('Wednesday, August 12, 2015'), //Works with any valid Date formats like long format
      new Date("08-14-2015"), //Short format
      new Date(1439676000000) //UNIX format
    ];

    var weekDaysList = ["Sun", "Mon", "Tue", "Wed", "thu", "Fri", "Sat"];

    var datePickerCallback = function (val) {
      if (typeof(val) === 'undefined') {
        console.log('No date selected');
      } else {
        console.log('Selected date is : ', val);
        $scope.start_dateObject.inputDate = val;
              
      }
    };
	
    $scope.send_search = function() {
      var data = $rootScope.search;
      $rootScope.tour = {};

      $http.post('http://onholidays.workplay.in/search/', data).
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
  })

  .controller('CountryCtrl', function($scope,$http,$rootScope,$ionicHistory) {



    $http.get('http://onholidays.workplay.in/countries/').
      success(function(data, status, headers, config) {
         // $scope.countries = $scope.countries.concat(data);
        $scope.countries = data ; 
        console.log($scope.countries);
      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
     });

    $http.get('http://onholidays.workplay.in/cities/').
      success(function(data, status, headers, config) {
         // $scope.countries = $scope.countries.concat(data);
        $scope.cities = data ; 
      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
     });

    $scope.chooseCountry = function(country) {
      $rootScope.search.country = country;
      $ionicHistory.goBack();
    };

    $scope.chooseCity = function(city) {
      $rootScope.search.city = city;
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

        // $scope.chooseMale = function() { 
        //      $cordovaDialogs.prompt('msg', 'title', ['btn 1','btn 2'], 'default text')
        //       .then(function(result) {
        //         var input = result.input1;
        //         // no button = 0, 'OK' = 1, 'Cancel' = 2
        //         var btnIndex = result.buttonIndex;
        //       });
        // };

        $scope.chooseMale = function() {

          $scope.sexList = [
            { text: "male", value: "m" },
            { text: "female", value: "f"}
          ];

         $scope.sexListChange = function(item) {
            console.log("Selected Serverside, text:", item.text, "value:", item.value);
          };  
                 

          // An elaborate, custom popup
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


    
    
    //Datepicker
    var picked_date = new Date();

	  $scope.birthdayDateObject = {
      titleLabel: 'Title',  //Optional
      todayLabel: 'Today',  //Optional
      closeLabel: 'Close',  //Optional
      setLabel: 'Set',  //Optional
      errorMsgLabel : 'Please select time.',    //Optional
      setButtonType : 'button-assertive',  //Optional
      inputDate: picked_date,    //Optional
      mondayFirst: true,    //Optional
      disabledDates:disabledDates,  //Optional
      from: new Date(1920, 7, 2),   //Optional
      to: new Date(2015, 12, 29),    //Optional
      callback: function (val) {    //Mandatory
        datePickerCallback(val);
      }
    };

    $scope.passportDateObject = {
      titleLabel: 'Title',  //Optional
      todayLabel: 'Today',  //Optional
      closeLabel: 'Close',  //Optional
      setLabel: 'Set',  //Optional
      errorMsgLabel : 'Please select time.',    //Optional
      setButtonType : 'button-assertive',  //Optional
      inputDate: picked_date,    //Optional
      mondayFirst: true,    //Optional
      disabledDates:disabledDates,  //Optional
      from: new Date(1920, 7, 2),   //Optional
      to: new Date(2015, 12, 29),    //Optional
      callback: function (val) {    //Mandatory
        datePickerCallback(val);
      }
    };



    var disabledDates = [
      new Date(1437719836326),
      new Date(),
      new Date(2015, 7, 10), //months are 0-based, this is August, 10th!
      new Date('Wednesday, August 12, 2015'), //Works with any valid Date formats like long format
      new Date("08-14-2015"), //Short format
      new Date(1439676000000) //UNIX format
    ];

    var weekDaysList = ["Sun", "Mon", "Tue", "Wed", "thu", "Fri", "Sat"];

    var datePickerCallback = function (val) {
      if (typeof(val) === 'undefined') {
        console.log('No date selected');
      } else {
        console.log('Selected date is : ', val);
        $scope.birthdayDateObject.inputDate = val;
              
      }
    };

	})

	.controller('MainCtrl', function($scope) {
	  $scope.rate = 3;
	  $scope.max = 5;
	});