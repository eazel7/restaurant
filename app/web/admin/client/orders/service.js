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