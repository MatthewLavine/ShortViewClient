angular.module('ServerStats').controller('mainCtrl', ['$rootScope', '$scope', function($rootScope, $scope) {
    $scope.addServer = function(ip, port) {
        $rootScope.hostList.push({
            ip: ip,
            port: port
        });
    };

    $scope.removeServer = function(index) {
        $rootScope.hostList.splice(index, 1);
    }
}]);