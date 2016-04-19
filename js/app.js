angular.module('ServerStats', ['ngRoute', 'routes']).run(['$rootScope', function($rootScope) {
    $rootScope.hostList = [
        {
            ip: '45.79.164.129',
            port: '9235'
        }];
}]);