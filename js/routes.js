angular.module('routes', []).config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/_index.html',
            controller: 'mainCtrl'
        }).when('/cpu', {
            templateUrl: 'views/_cpu.html',
            controller: 'cpuCtrl'
        }).when('/ram', {
            templateUrl: 'views/_ram.html',
            controller: 'ramCtrl'
        }).otherwise({
            redirectTo: '/'
        });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);