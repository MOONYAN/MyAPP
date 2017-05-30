angular.module('2017Apps').controller('UserController', ['$rootScope', 'UserService', 'AccountService', 'AlertService', function ($rootScope, UserService, AccountService, AlertService) {
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
            self.loginUser = $rootScope.loginUser;
            self.accounts = $rootScope.loginUser.accounts;
            self.account = $rootScope.account || null;
            self.mode = ($rootScope.role === 'manager') ? true : false;
            var openedStores = self.accounts.map((account) => { return account.storeId; });
            self.unOpenStores = ['00', '01', '02', '22', '24'].filter((storeId) => { return !openedStores.includes(storeId); });
        }
    };

    init();

    self.login = function () {
        if (!self.user.username || !self.user.password) {
            AlertService.alertPopup('錯誤!', '請輸入帳號或密碼');
        } else {
            FCMPlugin.getToken(function (deviceToken) {
                self.user.deviceToken = deviceToken;
                UserService.login(self.user, function (data) {
                    if (data.error)
                        AlertService.alertPopup('錯誤!', data.error);
                    else {
                        $rootScope.user = self.user;
                        $rootScope.loginUser = data.loginUser;
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
                UserService.register(self.user, function (data) {
                    if (data.error) {
                        AlertService.alertPopup('錯誤!', data.error);
                    } else {
                        $rootScope.user = self.user;
                        $rootScope.loginUser = data.loginUser;
                        init();
                    }
                });
            });
        }
    };

    self.logout = function () {
        delete $rootScope.user;
        delete $rootScope.loginUser;
        delete $rootScope.account;
        delete $rootScope.role;
        init();
    };

    self.openAccount = function (storeId) {
        $rootScope.setStoreId(storeId);
        AccountService.openAccount({ userId: self.loginUser._id, username: self.loginUser.username }, function (data) {
            if (data.error)
                AlertService.alertPopup('錯誤!', data.error);
            else {
                FCMPlugin.subscribeToTopic($rootScope.storeTopic);
                self.login();
            }
        });
    };

    self.loginAccount = function(account) {
        $rootScope.setStoreId(account.storeId);
        AccountService.loginAccount({ accountId: account.accountId },
            function(data) {
                if (data.err)
                    AlertService.alertPopup('錯誤!', data.error);
                else {
                    $rootScope.account = data.account;
                    $rootScope.role = data.account.role;
                    init();
                }
            });
    };

    self.closeAccount = function () {
        AccountService.closeAccount(self.account._id, function (data) {
            if (data.error) {
                AlertService.alertPopup('錯誤!', data.error);
            } else {
                FCMPlugin.unsubscribeFromTopic($rootScope.storeTopic);
                delete $rootScope.account;
                delete $rootScope.role;
                self.login();
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