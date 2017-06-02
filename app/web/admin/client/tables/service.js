const angular = require('angular');
const config = require('config');

angular
    .module(
    (module.exports = 'restaurant.tables.service'),
    [
    ]
    )
    .service(
    'TablesService',
    function ($http, $q) {
        var service = {
            list: function () {
                return $http.get(config.apiUrl + '/tables').then(function (data) {
                    return data.data;
                });
            },
            delete: function (tableId) {
                return $http.delete(config.apiUrl + '/tables/' + encodeURIComponent(tableId))
                .then(function (data) {
                    return data.data;
                })
            },
            create: function (name) {
                return $http.post(config.apiUrl + '/tables', {
                    name: name
                })
                .then(function (data) {
                    return data.data;
                })
            },
            getTable: function (tableId) {
                return $http.get(config.apiUrl + '/tables/' + encodeURIComponent(tableId)).then(function (data) {
                    return data.data;
                });
            }
        };

        return service;
    }
    );