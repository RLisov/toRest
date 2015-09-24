// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('toRest', ['ionic', 'toRest.controllers', 'ionic.rating', 'tabSlideBox', 'uiSlider','ionic-datepicker','ngCordova'])

.run(function($ionicPlatform, $ionicSlideBoxDelegate,$rootScope) {
  $ionicPlatform.ready(function() {

    $rootScope.reserved = {
      male:''
    };

    $rootScope.search = { 
        country : int,          //индекс страны из базы
        city: int,              //индекс города из базы
        start_date : date,      //дата заезда от и
        end_date : date,        // до
        days : int ,            //количество ночей
        tourists :              //количество туристов
        {
            adult: int,         //взрослых
            children: int       //детей до 18 лет
        },
        cost : int,             //максимальная цена
        category : int ,        //уровень отеля, звезды
        food : int              //качество питания - индекс из базы
    };

   
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
    url: '/tourpage',
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

  .state('country', {
    url: '/country',
    /*abstract: 'true',*/
    templateUrl: 'templates/countries.html',
    controller: 'CountryCtrl'
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


  ;

  $urlRouterProvider.otherwise('/');
})
