var myApp = angular.module('myApp', ['ngRoute','ngResource','ngAnimate']);

//ROUTE PROVIDER
myApp.config(function($routeProvider){
  $routeProvider
    .when('/',{
      templateUrl: 'home.html',
      controller: 'homeController'
    })
    .when('/todo',{
      templateUrl: 'todo.html',
      controller:'firstcontroller'
    })
    .when('/colorChange',{
      templateUrl: 'color.html',
      controller:'secondcontroller'
    })
    .when('/forecast',{
      templateUrl: 'forecast.html',
      controller: 'forecastController'
    })
    .when('/forecast/:days',{
      templateUrl: 'forecast.html',
      controller: 'forecastController'
    })
    .when('/carousel',{
      templateUrl: 'carousel.html',
      controller: 'carouselController'
    })

});


// TO DO LIST

myApp.controller('firstcontroller',['$scope',function($scope){
  $scope.count = 0;
  $scope.selection;
  $scope.todoList = [];
  $scope.addTodo = function() {
    var newTask = {name: $scope.newTodo, completed: false};
    $scope.todoList.push(newTask);
    $scope.newTodo = "";
    $scope.count = $scope.count+1;
    console.log($scope.todoList);
  }
  $scope.removeTask = function(index){
    $scope.todoList.splice(index,1);
    $scope.count = $scope.count-1;
  }
  $scope.clearAll = function () {
    $scope.todoList.length = 0;
    $scope.count = 0;
  }
}]);

myApp.controller('secondcontroller',['$scope',function($scope){
  $scope.name= "";
}]);


//WEATHER FORECAST APPI

myApp.service('forecastService',function() {
    this.city = "Dallas, TX";
})

myApp.controller('homeController',['$scope','forecastService',function($scope, forecastService) {
  $scope.city = forecastService.city;
  $scope.$watch('city',function(){
    forecastService.city = $scope.city;
  })
}]);

myApp.controller('forecastController',['$scope','$resource','$routeParams','forecastService',function($scope,$resource,$routeParams,forecastService){
  $scope.city = forecastService.city;
  $scope.days = $routeParams.days || '2';
  $scope.weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast/daily?APPID=746febc5fdf042042383dc6bf77d1598",
      {
        callback: "JSON_CALLBACK"
      },
      {
        get:
          { method: "JSONP" }
      }
  );
  //$scope.weatherResult = $scope.weatherAPI.get({q: $scope.city, cnt: $scope.days });
  $scope.weatherAPI.get({q: $scope.city, cnt: $scope.days },function(res) {
    $scope.weatherResult = res;
    console.log(res);
  });
  $scope.convertToFarenheit = function(degK) {
    return Math.round((1.8 * (degK - 273)) + 32);
  }
  $scope.convertToDate = function(dt) {
    return new Date(dt * 1000);
  }
}]);

myApp.directive('weatherReport',function(){
  return {
    restrict: 'E',
    replace: 'true',
    templateUrl: 'directives/weatherReport.html',
    scope: {
      weatherDay: "=",
      convertToStandard: "&",
      convertToDate: "&",
      DateFormat: "@"
    }
  }
});

//CHANGE COLOR
myApp.directive('changeColor',function() {
  return {
    restrict: 'E',
    replace: 'true',
    template: '<h1 style="background-color:{{color}}"> Hello {{name}}</h1>',
    link: function(scope,elem,attr) {
      elem.bind('click',function(){
        elem.css('background-color','white');
        scope.$apply(function(){
          scope.color = "white";
        });
      });
      elem.bind('mouseover',function(){
        elem.css('cursor','pointer');
      });
    }
  };
});


//CAROUSEL
myApp.controller('carouselController',['$scope',function($scope) {
  console.log('Carousel Controller');
  var c = angular.element(document).find('#myCarousel');
  var car = $(c);
  car.carousel();
  $scope.left = function() {
    car.carousel('prev');
  }
  $scope.right = function() {
    car.carousel('next');
  }

  $scope.slide = [
    {image:'IMG_7359_1.JPG',caption:'Cute'},
    {image:'IMG_9310.JPG',caption:'Beautiful'},
    {image:'IMG_6962.JPG',caption:'Amazing'}
  ];
}]);
