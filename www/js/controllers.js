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
	  }
	})

	.controller('FavouritesCtrl', function($scope) {
	  $scope.rate = 3;
	  $scope.max = 5;
	})

	.controller('TourpageCtrl', function($scope, $ionicSlideBoxDelegate) {
	  $scope.rate = 3;
	  $scope.max = 5;
	  $scope.choice = "A";

	  $scope.gallerySlider = function(index) {
	  	// $ionicSlideBoxDelegate.$getByHandle('gallery').slide($index);
	  	console.log('index gallerry', index);
	  }
	})

	.controller('MainCtrl', function($scope) {
	  $scope.rate = 3;
	  $scope.max = 5;
	});