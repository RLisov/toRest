// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('toRest', ['ionic', 'toRest.controllers', 
                          'ionic.rating', 'tabSlideBox', 'uiSlider','ionic-datepicker','ngCordova'])

.run(function($ionicPlatform, $ionicSlideBoxDelegate,$rootScope,$ionicPopup) {
  $ionicPlatform.ready(function() {

    $rootScope.showAlert = function(title, message) {
      $ionicPopup.alert({
        title: title,
        content: message
      }).then(function(res) {
        
      });
    };

    $rootScope.reserved = {
      male:''
    };

    //$rootScope.baseUrl = 'http://onholidays.workplay.in/api';
    $rootScope.baseUrl = 'http://185.43.5.29/api';


    $rootScope.reset_search = { 
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
        minCost: 1000,
        maxCost : 100000,
        cost : 1200,
        category : 3,
        food : "Не выбрано"
    };
    $rootScope.search = $rootScope.reset_search;

    $rootScope.tour = { 
    }
   
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
    templateUrl: 'templates/tourpage.html',
    controller: 'TourpageCtrl'
  })

  .state('reserved', {
    url: '/reserved',
    templateUrl: 'templates/reserved.html',
    controller: 'ReservedCtrl'
  })

  .state('citizenship', {
    url: '/country',
    templateUrl: 'templates/countries.html',
    controller: 'CountryCtrl'
  })

  .state('countryOrigin', {
    url: '/country',
    templateUrl: 'templates/countries.html',
    controller: 'CountryCtrl'
  })

  .state('countryDestination', {
    url: '/country',
    templateUrl: 'templates/countries.html',
    controller: 'CountryCtrl'
  })

  .state('cityOrigin', {
    url: '/city',
    templateUrl: 'templates/cities.html',
    controller: 'CitiesCtrl'
  })

   .state('cityDestination', {
    url: '/city',
    templateUrl: 'templates/cities.html',
    controller: 'CitiesCtrl'
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
