angular.module('toRest.controllers', [])

	.controller('SearchCtrl', function($scope) {
	  $scope.rate = 3;
	  $scope.max = 5;

	  $scope.search = {
	  	country: 0,
	  	city: 0,
	  	minDepartureDay: '29.01.2015',
	  	maxDepartureDay: '29.03.2015',
	  	minDay: 2,
	  	maxDay: 9,
	  	touristsCount: 2,
	  	minPrice: 12990,
	  	maxPrice: 24990
	  };

  })

	.controller('FavouritesCtrl', function($scope) {

	  $scope.rate = 3;
	  $scope.max = 5;
	})

	.controller('TourpageCtrl', function($scope,$timeout, $ionicSlideBoxDelegate,$ionicLoading, $compile) {
	  $scope.rate = 3;
	  $scope.max = 5;
	  $scope.choice = "A";
	  $scope.tabIndex = 0;
	  
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
    
    // initialize GOOGLE MAP
 //    function initialize() {
 //        var myLatlng = new google.maps.LatLng(43.07493,-89.381388);;
        
 //        var mapOptions = {
 //          center: myLatlng,
 //          zoom: 16,
 //          mapTypeId: google.maps.MapTypeId.ROADMAP
 //        };
 //        var map = new google.maps.Map(document.getElementById("map"),
 //            mapOptions);
        
 //        //Marker + infowindow + angularjs compiled ng-click
 //        var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
 //        var compiled = $compile(contentString)($scope);

 //        var infowindow = new google.maps.InfoWindow({
 //          content: compiled[0]
 //        });

 //        var marker = new google.maps.Marker({
 //          position: myLatlng,
 //          map: map,
 //          title: 'Uluru (Ayers Rock)'
 //        });

 //        google.maps.event.addListener(marker, 'click', function() {
 //          infowindow.open(map,marker);
 //        });

 //        $scope.map = map;
 //      }
 //      google.maps.event.addDomListener(window, 'load', initialize);
      
 //      $scope.centerOnMe = function() {
 //        if(!$scope.map) {
 //          console.log('me here');
 //          return;
 //        }

 //        $scope.loading = $ionicLoading.show({
 //          content: 'Getting current location...',
 //          showBackdrop: false
 //        });

 //        navigator.geolocation.getCurrentPosition(function(pos) {
 //          $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
 //          $scope.loading.hide();
 //        }, function(error) {
 //          alert('Unable to get location: ' + error.message);
 //        });
 //      };
      
 //      $scope.clickTest = function() {
 //        alert('Example of infowindow with ng-click')
 //      };

	})

	
	.controller('ReservedCtrl', function($scope,$cordovaDialogs,$ionicPlatform) {

        $scope.chooseMale = function() { 
             $cordovaDialogs.prompt('msg', 'title', ['btn 1','btn 2'], 'default text')
              .then(function(result) {
                var input = result.input1;
                // no button = 0, 'OK' = 1, 'Cancel' = 2
                var btnIndex = result.buttonIndex;
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