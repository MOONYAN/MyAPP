angular.module('2017Apps').factory('tokenInterceptor', ['$rootScope', function ($rootScope) {
    var roleToken;
    return {
        request: function (config) {
            if (roleToken)
                config.headers.Authorization = $rootScope.useCenterToken ? $rootScope.centerToken : roleToken;
            $rootScope.useCenterToken = false;
            return config;
        },
        response: function (response) {
            if (response.headers('Authorization')) {
                roleToken = response.headers('Authorization');
            }
            return response;
        }
    };
}]);