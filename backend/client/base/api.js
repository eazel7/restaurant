var apiDescription = require('api-description');

require('angular')
    .module(
    (module.exports = 'restaurant.api'),
    [
    ]
    )
    .service(
    'API',
    function ($http) {
        var service = {};
        var baseUrl = apiDescription.baseUrl;
        var apis = apiDescription.apis;

        var serviceMethod = function (serviceName, methodName, argNames) {
            return function () {
                var args = {};

                for (var i = 0; i < argNames.length; i++) args[argNames[i]] = arguments[i];

                return $http.post(
                    baseUrl + '/service/' + encodeURIComponent(serviceName) + '/' + encodeURIComponent(methodName),
                    args
                )
                    .then(function (data) { return data.data; });
            };
        }

        for (var apiName in apis) {
            service[apiName] = {};

            for (var methodName in apis[apiName]) {
                service[apiName][methodName] = serviceMethod(apiName, methodName, apis[apiName][methodName])
            }
        }

        return service;
    }
    )