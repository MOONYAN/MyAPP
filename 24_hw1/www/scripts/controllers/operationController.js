angular.module('2017Apps').controller('OperationController', ['$rootScope', '$ionicPopup', '$timeout', '$filter', '$state', 'AlertService', 'AccountService', function ($rootScope, $ionicPopup, $timeout, $filter, $state, AlertService, AccountService) {
    var self = this;
    
    var init = function () {
        if (typeof $rootScope.account === 'undefined')
            self.isLoggedIn = false;
        else {
            self.isLoggedIn = true;
            self.account = $rootScope.account;
            self.account.amount = '';
        }
        $timeout(function () {
            self.showMessage = '';
        }, 2000);
    };

    var popupSusccess = function (alertMessage) {
        $ionicPopup.alert({
            title: '交易成功',
            template: alertMessage,
            buttons: [{
                text: '確定',
                type: 'button-dark'
            }, {
                text: '查看',
                type: 'button-dark',
                onTap: function (e) {
                    $state.go('tab.transactions');
                }
            }]
        });
    };

    init();

    self.deposit = function () {
        if (self.isLoggedIn === false)
            AlertService.alertPopup('請登入或開戶');
        else if (!self.account.amount)
            AlertService.alertPopup('請輸入金額');
        else {
            AccountService.operation(self.account, function (data) {
                $rootScope.account.balance = data.account.balance;
                self.showMessage = $rootScope.account.name + ' 已儲值 ' + $filter('currency')(self.account.amount, '', 0) + '元';
                popupSusccess(self.showMessage);
                init();
            });
        }
    }

    self.buy = function () {
        if (self.isLoggedIn === false)
            AlertService.alertPopup('請登入或開戶');
        else if (!self.account.amount)
            AlertService.alertPopup('請輸入金額');
        else if (self.account.amount > self.account.balance)
            AlertService.alertPopup('餘額不足');
        else {
            self.account.amount *= -1;
            AccountService.operation(self.account, function (data) {
                $rootScope.account.balance = data.account.balance;
                self.account.amount = Math.abs(self.account.amount);
                self.showMessage = $rootScope.account.name + ' 已消費 ' + $filter('currency')(Math.abs(self.account.amount), '', 0) + '元', 'tab.transactions';
                popupSusccess(self.showMessage);
                init();
            });
        }
    }
}]);
