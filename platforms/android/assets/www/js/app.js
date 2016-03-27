// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('toRest', ['ionic', 'toRest.controllers', 
                          'ionic.rating', 'tabSlideBox', 'uiSlider','ionic-datepicker','ngCordova'])

.run(function($ionicPlatform, $ionicSlideBoxDelegate,$rootScope) {
  $ionicPlatform.ready(function() {

    $rootScope.reserved = {
      male:''
    };

    $rootScope.baseUrl = 'http://onholidays.workplay.in/api';


    $rootScope.search = { 
        country_origin : 
        {
          name: "Выберите страну отправления",
          id: 0
        },
        city_origin :
        {
          name: "Выберите город отправления",
          id: 0
        },
        country_destination :
        {
          name: "Выберите страну назначения",
          id: -1
        },
        city_destination :
        {
          name: "Выберите город назначения",
          id: -1
        },
        start_date : new Date(),
        end_date : new Date(),
        minDays : 3,
        maxDays: 9,
        tourists :
        {
            adult: 2,
            children: 1
        },
        minCost: 12000,
        maxCost : 100000,
        cost : 1200,
        category : 3,
        food : "Не выбрано"
    };

    $rootScope.tour = { 
    }
   
    // $ionicSlideBoxDelegate.$getByHandle('main-tabs').enableSlide(false);
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  $ionicConfigProvider.backButton.previousTitleText(false).text('');

  $stateProvider

  .state('home', {
    url: '/',
    templateUrl: 'templates/home.html',
    controller: 'MainCtrl'
  })

  .state('tourpage', {
    url: '/tourpage/:tourId',
    /*abstract: 'true',*/
    templateUrl: 'templates/tourpage.html',
    controller: 'TourpageCtrl'
  })

  .state('reserved', {
    url: '/reserved',
    /*abstract: 'true',*/
    templateUrl: 'templates/reserved.html',
    controller: 'ReservedCtrl'
  })

  .state('countryOrigin', {
    url: '/country',
    /*abstract: 'true',*/
    templateUrl: 'templates/countries.html',
    controller: 'CountryCtrl'
  })

  .state('countryDestination', {
    url: '/country',
    /*abstract: 'true',*/
    templateUrl: 'templates/countries.html',
    controller: 'CountryCtrl'
  })

  .state('cityOrigin', {
    url: '/city',
    /*abstract: 'true',*/
    templateUrl: 'templates/cities.html',
    controller: 'CitiesCtrl'
  })

   .state('cityDestination', {
    url: '/city',
    /*abstract: 'true',*/
    templateUrl: 'templates/cities.html',
    controller: 'CitiesCtrl'
  })



/*  .state('tourpage.main', {
    url: '/main',
    templateUrl: 'templates/tourpage/_main.html',
    controller: 'TourpageCtrl'
  })

  .state('tourpage.gallery', {
    url: '/gallery',
    templateUrl: 'templates/tourpage/_gallery.html',
    controller: 'TourpageCtrl'
  })*/

  .state('favourites', {
    url: '/favourites',
    templateUrl: 'templates/favourites.html',
    controller: 'FavouritesCtrl'
  })

  .state('search', {
    url: '/search',
    templateUrl: 'templates/search.html',
    controller: 'SearchCtrl'
  })

  .state('search_results', {
    url: '/search_results',
    templateUrl: 'templates/search_results.html',
    controller: 'SearchResultsCtrl'
  })


  ;

  $urlRouterProvider.otherwise('/');
})
