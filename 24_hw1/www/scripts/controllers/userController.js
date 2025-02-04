﻿angular.module('2017Apps').controller('UserController', ['$rootScope', 'UserService', 'AccountService', 'AlertService', function ($rootScope, UserService, AccountService, AlertService) {
    var self = this;

    var init = function () {
        if (typeof $rootScope.user === 'undefined') {
            self.isLoggedIn = false;
            self.user = {
                username: '',
                password: '',
                deviceToken: ''
            };
        } else {
            self.isLoggedIn = true;
            self.user = $rootScope.user;
            self.account = $rootScope.account ? $rootScope.account : null;
            self.mode = ($rootScope.role === 'manager') ? true : false;
        }
    };

    init();

    self.login = function () {
        if (!self.user.username || !self.user.password) {
            AlertService.alertPopup('錯誤!', '請輸入帳號或密碼');
        } else {
            FCMPlugin.getToken(function (deviceToken) {
                self.user.deviceToken = deviceToken;
                self.user.deviceToken = 'cT1Th9b3XMI:APA91bH1xuAFGxqj8Ow5IelZMtTU6mq5zznPL5v-Wp7nf3NWyzVVsGB4SJ01L4gvzCE8F6lUsfyzBQlsu08-_fdW_DXmJj5ZjxuV3IFbEykFUxFJOP472_Vx5YK8woalT_Kf55FV5Tb7';
                UserService.login(self.user, function (data) {
                    if (data.error)
                        AlertService.alertPopup('錯誤!', data.error);
                    else {
                        $rootScope.user = data.loginUser;
                        if (data.account) {
                            $rootScope.account = data.account;
                            $rootScope.role = data.account.role;
                        }
                        init();
                    }
                });
            });
        }
    };

    self.register = function () {
        if (!self.user.username || !self.user.password) {
            AlertService.alertPopup('錯誤!', '請輸入帳號或密碼');
        } else {
            FCMPlugin.getToken(function (deviceToken) {
                self.user.deviceToken = deviceToken;
                self.user.deviceToken = 'cT1Th9b3XMI:APA91bH1xuAFGxqj8Ow5IelZMtTU6mq5zznPL5v-Wp7nf3NWyzVVsGB4SJ01L4gvzCE8F6lUsfyzBQlsu08-_fdW_DXmJj5ZjxuV3IFbEykFUxFJOP472_Vx5YK8woalT_Kf55FV5Tb7';
                UserService.register(self.user, function (data) {
                    if (data.error) {
                        AlertService.alertPopup('錯誤!', data.error);
                    } else {
                        $rootScope.user = data.loginUser;
                        init();
                    }
                });
            });
        }
    };

    self.logout = function () {
        delete $rootScope.user;
        delete $rootScope.account;
        delete $rootScope.role;
        init();
    };

    self.openAccount = function () {
        AccountService.openAccount({ userId: self.user._id, storeId: $rootScope.storeId }, function (data) {
            if (data.error)
                AlertService.alertPopup('錯誤!', data.error);
            else {
                FCMPlugin.subscribeToTopic($rootScope.storeTopic);
                $rootScope.account = data.account;
                $rootScope.role = data.account.role;
                init();
            }
        });
    };

    self.closeAccount = function () {
        AccountService.closeAccount($rootScope.storeId, self.account._id, function (data) {
            if (data.error) {
                AlertService.alertPopup('錯誤!', data.error);
            } else {
                FCMPlugin.unsubscribeFromTopic($rootScope.storeTopic);
                delete $rootScope.account;
                delete $rootScope.role;
                init();
            }
        });
    };

    self.switchMode = function () {
        AccountService.switchMode({ accountId: self.account._id, role: self.mode ? 'manager' : 'customer' }, function (data) {
            $rootScope.account = data.account;
            $rootScope.role = data.account.role;
            init();
        });
    };
}]);