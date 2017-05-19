angular.module('2017Apps').run(['$rootScope', '$ionicPlatform', 'AlertService', function ($rootScope, $ionicPlatform, AlertService) {
    $rootScope.storeId = '24';
    //$rootScope.iStoreUrl = 'http://127.0.0.1:30' + $rootScope.storeId + '/apps' + $rootScope.storeId + '/istore';
    $rootScope.iStoreUrl = 'http://104.199.219.156:8080/apps' + $rootScope.storeId + '/istore';
    $rootScope.storeTopic = 'store' + $rootScope.storeId;

    $ionicPlatform.ready(function () {
        FCMPlugin.onNotification(function (data) {
            if (!data.wasTapped) {
                AlertService.alertPopup(data.title, data.body);
            }
        });
    });
}]);