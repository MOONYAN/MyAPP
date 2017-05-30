angular.module('2017Apps').run(['$rootScope', '$ionicPlatform', 'AlertService', function ($rootScope, $ionicPlatform, AlertService) {
    $rootScope.storeId = '24';
    $rootScope.iStoreCenter = 'https://ilab.csie.io/apps09/istore';
    $rootScope.iStoreUrl = 'https://ilab.csie.io/apps' + $rootScope.storeId + '/istore';
    $rootScope.storeTopic = 'store' + $rootScope.storeId;

    $rootScope.useCenterToken = false;
    $rootScope.centerToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiY3VzdG9tZXIiLCJpYXQiOjE0OTUyNjMyMjcsImV4cCI6MTUyNjc5OTIyN30.IoFk47eFUTp6lfY_iO6slaubWz02LnL3_oqezZ5tOjo';

    $rootScope.setStoreId = function (storeId) {
        $rootScope.storeId = storeId;
        $rootScope.iStoreUrl = 'https://ilab.csie.io/apps' + storeId + '/istore';
        $rootScope.storeTopic = 'store' + storeId;
    };

    $ionicPlatform.ready(function () {
        FCMPlugin.onNotification(function (data) {
            if (!data.wasTapped) {
                AlertService.alertPopup(data.title, data.body);
            }
        });
    });
}]);