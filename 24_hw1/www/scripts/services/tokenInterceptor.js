angular.module('2017Apps').factory('tokenInterceptor', [function () {
    var token;
    return {
        request: function (config) {
            if (token)
                config.headers.Authorization = token;            
            return config;
        },
        response: function (response) {
            if (response.headers('Authorization')) {
                token = response.headers('Authorization');
            }
            return response;
        }
    };
}]);