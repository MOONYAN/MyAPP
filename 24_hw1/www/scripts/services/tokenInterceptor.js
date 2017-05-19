angular.module('2017Apps').factory('tokenInterceptor', [function () {
    var roleToken;
    return {
        request: function (config) {
            if (roleToken)
                config.headers.Authorization = roleToken;
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