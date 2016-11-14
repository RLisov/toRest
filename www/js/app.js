angular.module('toRest', [
  'ionic', 
  'toRest.controllers',
  'toRest.filters',
  'ionic.rating', 
  'tabSlideBox', 
  'uiSlider',
  'ionic-datepicker',
  'ngCordova'
])

.run(function($ionicPlatform, $ionicSlideBoxDelegate,$rootScope,$ionicPopup,ionicDatePicker,$ionicLoading,$http,$state,$interval) {

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

  //dev
  $rootScope.baseUrl = '/v1';
  //production
  //$rootScope.baseUrl = 'http://185.43.5.29/v1';


  $rootScope.reset_search = { 
      "country_origin" : 
      {
        "name": "Россия",
        "id": 150
      },
      "city_origin" :
      {
        "name": "Москва",
        "id": 832
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
      "end_date" : new Date().setDate(new Date().getDate() + 3),
      "minDays" : 5,
      "maxDays" : 9,
      "tourists" : [0],
      "minCost" : 1000,
      "maxCost" : 100000,
      "category" : [400, 401, 402, 403, 404, 405, 406],
      "food" : [112]
  };
  $rootScope.search = angular.copy($rootScope.reset_search);

  $rootScope.get_arrive_date = function(depart_date, duration) {
    var arrive_date = new Date( depart_date.replace( /(\d{2}).(\d{2}).(\d{4})/, "$2/$1/$3"));
    return $rootScope.format_date(arrive_date.setDate(arrive_date.getDate() + duration*1));
  }

  $rootScope.format_date = function(source_date) {
    var date = new Date(source_date);
    var curr_date = date.getDate();
    var curr_month = date.getMonth();
    var curr_year = date.getFullYear();
    return (('0' + curr_date).slice(-2))+"."+(('0'+(curr_month*1+1)).slice(-2)) + "." + curr_year;
  };

  $rootScope.tourists_scope = [18,18];

  var loading_progress = false,
        counts_timeout   = 0;

  $rootScope.stopLoading = function() {
    $interval.cancel(loading_progress);
    $ionicLoading.hide();
  }

  $rootScope.goResults = function() {
    $rootScope.stopLoading();
    $state.go('search_results');
  }

  $rootScope.send_search = function() {

    var startLoading = function() {
      counts_timeout = 0;
      $rootScope.showCancelSearchButton = false;
      $rootScope.toursCount = 0;
      $rootScope.loading_text = "Поиск займёт некоторое время<br/>Устраивайтесь поудобнее..."
      var loading_texts = [ "Ищем туры...", "Пакуем чемоданы...", "Сверяем данные...", 
                            "Подбираем гавайские рубашки...", "Созваниваемся с отелями...", "Смотрим фото номеров...", 
                            "Ищем пляжи...", "Составляем маршрут...", "Пробуем завтраки...", "Проверяем билеты...", 
                            "Изучаем вид из окна..."];

      loading_progress = $interval(function() {
        counts_timeout++;
        checkProgress();
        $rootScope.loading_text = loading_texts[Math.floor(Math.random()*loading_texts.length)]
        if (counts_timeout > 5) {
          $rootScope.showCancelSearchButton = ($rootScope.toursCount == 0);
        }
      }, 3000);

      $ionicLoading.show({
        templateUrl: "templates/partials/search_loading.html",
        noBackdrop: false
      });
    };

    var checkProgress = function() {
      $http.get($rootScope.baseUrl + '/request/' + $rootScope.requestId + '/').
        success(function(data, status, headers, config) {
          console.log(data);
          switch (data.status) {
            case 'done':
              $rootScope.goResults();
              break
            case 'processing':
              $rootScope.toursCount = data.count_found_tour;
              break
            case 'error':
              $rootScope.showAlert('Неудачно!','Ошибка в ответе сервера');
              break
          }
        }).
        error(function(data, status, headers, config) {
          $rootScope.stopLoading();
          $rootScope.showAlert('Неудачно!','Ошибка в ответе сервера');
          console.log(data);
        });
    }

    var data = {
      //country_origin : $rootScope.search.country_origin.id,          
      city_origin: $rootScope.search.city_origin.id,              
      country_destination : $rootScope.search.country_destination.id,          
      //city_destination: $rootScope.search.city_destination.id,              
      start_date : $rootScope.format_date($rootScope.search.start_date),      
      end_date : $rootScope.format_date($rootScope.search.end_date),        
      min_days : $rootScope.search.minDays*1,
      max_days : $rootScope.search.maxDays*1,
      min_cost : $rootScope.search.minCost*1,
      max_cost : $rootScope.search.maxCost*1,             
      category : $rootScope.search.category,
      food : $rootScope.search.food,
      tourists: $rootScope.tourists_scope
    }
    console.log(data);

    $http.post($rootScope.baseUrl+'/request/', data).
      success(function(data, status, headers, config) {
        $rootScope.requestId = data.id;
        startLoading();
      }).
      error(function(data, status, headers, config) {
        $interval.cancel(loading_progress);
        $ionicLoading.hide();
        $rootScope.showAlert('Неудачно!','Ошибка в ответе сервера');
        console.log(data);
      });
  };

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
    url: '/tourpage/:hotelId',
    templateUrl: 'templates/tourpage.html',
    controller: 'TourpageCtrl'
  })

  .state('reserved', {
    url: '/reserved/:tourId',
    templateUrl: 'templates/reserved.html',
    controller: 'ReservedCtrl'
  })

  .state('tourist', {
    url: '/tourist/:touristIndex',
    templateUrl: 'templates/tourist.html',
    controller: 'TouristCtrl'
  })

  .state('citizenship', {
    url: '/country/:touristIndex',
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
  });

  $urlRouterProvider.otherwise('/');
});

angular.module('toRest.controllers', []);
angular.module('toRest.filters', []);
