angular.module('toRest.controllers', [])

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