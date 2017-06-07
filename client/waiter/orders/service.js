var config = require('config');

require('angular')
.module(
    (module.exports = 'restaurant.orders.service'),
    []
)
.service(
    'OrdersService',
    function ($http) {
        var service = {
            closeTable: function (tableId) {
                return $http
                .post(config.apiUrl + '/orders/table/' + encodeURIComponent(tableId) + '/close-table', {})
                .then(function (data) {
                    return data.data;
                })
            },
            getOrder: function (orderId) {
                return $http.get(config.apiUrl + '/orders/order/'  +encodeURIComponent(orderId))
                .then(function (data) {
                    return data.data;
                })
            },
            placeOrder: function (tableId, dishId, optionals) {
                return $http
                .post(
                    config.apiUrl + '/orders/order',
                    {
                        table: tableId,
                        dish: dishId,
                        optionals: optionals
                    }
                )
                .then(function (data) {
                    return data.data;
                })
            },
            listByTable: function (tableId) {
                return $http
                .get(
                    config.apiUrl + '/orders/by-table/' + encodeURIComponent(tableId)
                )
                .then(function (data) {
                    return data.data;
                })
            }
        };

        return service;
    }
)