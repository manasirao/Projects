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
            controller:'firstController'
        })
        .when('/colorChange',{
            templateUrl: 'color.html',
            controller:'secondController'
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
        .when('/editor',{
            templateUrl: 'editor.html',
            controller: 'editorController'
        })
        .when('/order',{
            templateUrl: 'order.html',
            controller: 'orderController'
        })
        .when('/grid',{
            templateUrl: 'grid.html',
            controller: 'gridController'
        })
});


// TO DO LIST

myApp.controller('firstController',['$scope','$route',function($scope,$route){
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
    console.log($route.current);
}]);

myApp.controller('secondController',['$scope','$route',function($scope,$route){
    $scope.name= "";
    $scope.showOrHide = false;
    $scope.showName = "Hide Element";

    $scope.toggleElem = function() {
        $scope.showOrHide = !$scope.showOrHide;
        if($scope.showOrHide) {
            $scope.showName = "Show Element";
        } else {
            $scope.showName = "Hide Element"
        }

    }
    console.log($route.current);
}]);


//WEATHER FORECAST APPI

myApp.service('forecastService',function() {
    this.city = "Dallas, TX";
})

myApp.controller('homeController',['$scope','forecastService','$route',function($scope, forecastService,$route) {
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
    console.log($route.current);
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
myApp.controller('carouselController',['$scope','$route',function($scope,$route) {
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
    console.log($route.current);
}]);

//INLINE EDITOR
myApp.controller('editorController',['$scope',function($scope) {
    $scope.editArea='Edit Me';
    $scope.isHidden = false;
    $scope.editMe = function() {
        $scope.isHidden = !$scope.isHidden;

    }
}]);

//ORDER FORM
myApp.controller('orderController',['$scope', function($scope) {
    $scope.orderList = [
        { name: 'Frocks', price: 200, selected :false },
        { name: 'Skirts',price: 250, selected :false },
        { name: 'Shirts',price: 350, selected :false },
        { name: 'T-shirts',price: 150, selected :false },
        { name: 'Tie',price: 50, selected :false }
    ];
    $scope.total = 0;
    $scope.selectItem = function(item) {
        item.selected = !item.selected;
        if(item.selected) {
            $scope.total += item.price;
        } else {
            $scope.total = $scope.total - item.price;
        }
    }


}]);

//SWITCHABLE GRID
myApp.controller('gridController',['$scope','$http',function($scope,$http) {
    $http.get('products.json').success(function(data) {
        $scope.products = data;
    });

    $scope.listed = false;
    $scope.grid = false;
    $scope.showList = function() {
        $scope.listed = true;
        $scope.grid = false;
    }
    $scope.showGrid = function() {
        $scope.listed = false;
        $scope.grid = true;
    }
}]);