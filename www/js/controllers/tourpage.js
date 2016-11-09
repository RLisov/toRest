angular.module('toRest.controllers')

  .controller('TourpageCtrl', function($scope,$timeout,$ionicSlideBoxDelegate,$stateParams,$rootScope,$state) {
    $scope.max = 5;
    $scope.choice = null;
    $scope.tabIndex = 0;
    var tour_id = $stateParams.tourId;
    $scope.tour = $rootScope.tours.data[tour_id];
    $scope.arrive_date = $rootScope.get_arrive_date($scope.tour.date, $scope.tour.duration)
    console.log($scope.tour);
    $rootScope.reserved = {};
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
  });