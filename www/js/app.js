// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('toRest', ['ionic', 'toRest.controllers', 
                          'ionic.rating', 'tabSlideBox', 'uiSlider','ionic-datepicker','ngCordova'])

.run(function($ionicPlatform, $ionicSlideBoxDelegate,$rootScope,$ionicPopup,ionicDatePicker) {

  $rootScope.openDatePicker = function(picker){
    ionicDatePicker.openDatePicker(picker);
  };

  $rootScope.showAlert = function(title, message) {
    $ionicPopup.alert({
      title: title,
      content: message
    }).then(function(res) {
      
    });
  };

  $rootScope.reserved = {}

  //dev
  $rootScope.baseUrl = '/api';
  //production
  //$rootScope.baseUrl = 'http://185.43.5.29/api';


  $rootScope.reset_search = { 
      "country_origin" : 
      {
        "name": "Выберите страну отправления",
        "id": 0
      },
      "city_origin" :
      {
        "name": "Выберите город отправления",
        "id": 0
      },
      "country_destination" :
      {
        "name": "Выберите страну назначения",
        "id": -1
      },
      "city_destination" :
      {
        "name": "Выберите город назначения",
        "id": -1
      },
      "start_date" : new Date(),
      "end_date" : new Date(),
      "minDays" : 3,
      "maxDays" : 9,
      "tourists" : [0],
      "minCost" : 1000,
      "maxCost" : 100000,
      "category" : 1,
      "food" : 1
  };
  $rootScope.search = $rootScope.reset_search;

  $rootScope.tour = { 
  }

  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, ionicDatePickerProvider) {

  var datePickerObj = {
      inputDate: new Date(),
      setLabel: 'Выбрать',
      todayLabel: 'Сегодня',
      closeLabel: 'Закрыть',
      mondayFirst: true,
      weeksList: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
      monthsList: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
      templateType: 'popup',
      showTodayButton: true,
      dateFormat: 'dd.MM.yyyy',
      closeOnSelect: false,
      errorMsgLabel : 'Выберите дату'
  };
  ionicDatePickerProvider.configDatePicker(datePickerObj);

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
