angular.module('ServerStats').controller('cpuCtrl', ['$rootScope', '$scope', '$http', '$interval', function($rootScope, $scope, $http, $interval) {

    $scope.data = [];

    $rootScope.hostList.forEach(function(host, i) {
        $scope.data[i] = {};

        $http.get("http://" + host.ip + ":" + host.port + "/stats").success(function(data) {
            $scope.data[i].cpu0 = ['CPU0 Usage %'];
            $scope.data[i].cpu1 = ['CPU1 Usage %'];
            $scope.data[i].cpu2 = ['CPU2 Usage %'];
            $scope.data[i].cpu3 = ['CPU3 Usage %'];
            $scope.data[i].load = ['Total Load %'];
            $scope.data[i].lastUpdated = ['lastUpdated'];

            data.forEach(function(dataPoint) {
                $scope.data[i].cpu0.push(dataPoint.cpu0);
                $scope.data[i].cpu1.push(dataPoint.cpu1);
                $scope.data[i].cpu2.push(dataPoint.cpu2);
                $scope.data[i].cpu3.push(dataPoint.cpu3);
                $scope.data[i].load.push((dataPoint.cpu0+dataPoint.cpu1+dataPoint.cpu2+dataPoint.cpu3)/4);
                $scope.data[i].lastUpdated.push(moment(dataPoint.timestamp).format('MM/DD/YYYY HH:mm:ss'));
            });

            $scope.data[i].chart = c3.generate({
                bindto: '#chart' + i,
                data: {
                    x: 'lastUpdated',
                    xFormat: '%m/%d/%Y %H:%M:%S',
                    columns: [
                        $scope.data[i].lastUpdated,
                        $scope.data[i].cpu0,
                        $scope.data[i].cpu1,
                        $scope.data[i].cpu2,
                        $scope.data[i].cpu3,
                        $scope.data[i].load
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
                        padding: {top:0, bottom:0},
                        label: {
                            text: 'CPU Usage %',
                            position: 'outer-middle'
                        }
                    }
                }
            });
        });

        $scope.data[i].cpuCheck = $interval(function() {
            $http.get("http://" + host.ip + ":" + host.port + "/stats").success(function(data) {
                $scope.data[i].cpu0 = ['CPU0 Usage %'];
                $scope.data[i].cpu1 = ['CPU1 Usage %'];
                $scope.data[i].cpu2 = ['CPU2 Usage %'];
                $scope.data[i].cpu3 = ['CPU3 Usage %'];
                $scope.data[i].load = ['Total Load %'];
                $scope.data[i].lastUpdated = ['lastUpdated'];

                data.forEach(function(dataPoint) {
                    $scope.data[i].cpu0.push(dataPoint.cpu0);
                    $scope.data[i].cpu1.push(dataPoint.cpu1);
                    $scope.data[i].cpu2.push(dataPoint.cpu2);
                    $scope.data[i].cpu3.push(dataPoint.cpu3);
                    $scope.data[i].load.push((dataPoint.cpu0+dataPoint.cpu1+dataPoint.cpu2+dataPoint.cpu3)/4);
                    $scope.data[i].lastUpdated.push(moment(dataPoint.timestamp).format('MM/DD/YYYY HH:mm:ss'));
                });

                if($scope.data[i].lastUpdated.length > 60)
                    $scope.data[i].lastUpdated.splice(1, 1);

                if($scope.data[i].cpu0.length > 60)
                    $scope.data[i].cpu0.splice(1, 1);

                if($scope.data[i].cpu1.length > 60)
                    $scope.data[i].cpu1.splice(1, 1);

                if($scope.data[i].cpu2.length > 60)
                    $scope.data[i].cpu2.splice(1, 1);

                if($scope.data[i].cpu3.length > 60)
                    $scope.data[i].cpu3.splice(1, 1);

                if($scope.data[i].load.length > 60)
                    $scope.data[i].load.splice(1, 1);

                $scope.data[i].chart.load({
                    columns: [
                        $scope.data[i].lastUpdated,
                        $scope.data[i].cpu0,
                        $scope.data[i].cpu1,
                        $scope.data[i].cpu2,
                        $scope.data[i].cpu3,
                        $scope.data[i].load
                    ]
                });
            });
        }, 1000);

        $scope.$on('$destroy', function() {
            $interval.cancel($scope.data[i].cpuCheck);
        });
    });
}]);