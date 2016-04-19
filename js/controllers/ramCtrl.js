angular.module('ServerStats').controller('ramCtrl', ['$rootScope', '$scope', '$http', '$interval', function($rootScope, $scope, $http, $interval) {

    $scope.data = [];

    $rootScope.hostList.forEach(function(host, i) {
        $scope.data[i] = {};

        $http.get("http://" + host.ip + ":" + host.port + "/stats").success(function (data) {
            $scope.data[i].mem_Used = ['Memory Usage (MB)'];
            $scope.data[i].mem_Free = ['Memory Free (MB)'];
            $scope.data[i].lastUpdated = ['lastUpdated'];
            $scope.data[i].mem_Total = ['Total Memory (MB)'];

            data.forEach(function (dataPoint) {
                $scope.data[i].mem_Used.push((dataPoint.mem_total - dataPoint.mem_free) / 1000);
                $scope.data[i].mem_Free.push(dataPoint.mem_free / 1000);
                $scope.data[i].mem_Total.push(dataPoint.mem_total);
                $scope.data[i].lastUpdated.push(moment(dataPoint.timestamp).format('MM/DD/YYYY HH:mm:ss'));
            });

            $scope.data[i].chart = c3.generate({
                bindto: '#chart' + i,
                data: {
                    x: 'lastUpdated',
                    xFormat: '%m/%d/%Y %H:%M:%S',
                    columns: [
                        $scope.data[i].lastUpdated,
                        $scope.data[i].mem_Used,
                        $scope.data[i].mem_Free
                    ]
                },
                legend: {
                    show: true
                },
                axis: {
                    x: {
                        type: 'timeseries',
                        tick: {
                            culling: {
                                max: 5
                            },
                            format: '%m/%d/%Y %H:%M:%S'
                        },
                        label: {
                            text: 'Time'
                        }
                    },
                    y: {
                        min: 0,
                        padding: {top: 0, bottom: 0},
                        label: {
                            text: 'Memory Usage (MB)',
                            position: 'outer-middle'
                        }
                    }
                }
            });
        });

        $scope.data[i].ramCheck = $interval(function () {
            $http.get("http://" + host.ip + ":" + host.port + "/stats").success(function (data) {
                $scope.data[i].mem_Used = ['Memory Usage (MB)'];
                $scope.data[i].mem_Free = ['Memory Free (MB)'];
                $scope.data[i].lastUpdated = ['lastUpdated'];
                $scope.data[i].mem_Total = ['Total Memory (MB)'];

                data.forEach(function (dataPoint) {
                    $scope.data[i].mem_Used.push((dataPoint.mem_total - dataPoint.mem_free) / 1000);
                    $scope.data[i].mem_Free.push(dataPoint.mem_free / 1000);
                    $scope.data[i].mem_Total.push(dataPoint.mem_total);
                    $scope.data[i].lastUpdated.push(moment(dataPoint.timestamp).format('MM/DD/YYYY HH:mm:ss'));
                });

                if ($scope.data[i].mem_Used.length > 60)
                    $scope.data[i].mem_Used.splice(1, 1);

                if ($scope.data[i].mem_Free.length > 60)
                    $scope.data[i].mem_Free.splice(1, 1);

                if ($scope.data[i].mem_Total.length > 60)
                    $scope.data[i].mem_Total.splice(1, 1);

                if ($scope.data[i].lastUpdated.length > 60)
                    $scope.data[i].lastUpdated.splice(1, 1);

                $scope.data[i].chart.load({
                    columns: [
                        $scope.data[i].lastUpdated,
                        $scope.data[i].mem_Used,
                        $scope.data[i].mem_Free
                    ]
                });
            });
        }, 2000);

        $scope.$on('$destroy', function () {
            $interval.cancel($scope.data[i].ramCheck);
        });
    });
}]);