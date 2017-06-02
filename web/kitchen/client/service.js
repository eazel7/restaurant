var config = require('config');

require('angular')
    .module(
    (module.exports = 'restaurant.kitchen.service'),
    []
    )
    .service(
    'TablesService',
    function ($http) {
        return {
            getTable: function (tableId) {
                return $http.get(config.apiUrl + '/tables/' + encodeURIComponent(tableId))
                    .then(function (data) {
                        return data.data;
                    });
            }
        };
    })
    .service(
    'MenuService',
    function ($http) {
        return {
            getDishOptions: function (dishId) {
                return $http.get(config.apiUrl + '/menu/dishes/' + encodeURIComponent(dishId) + '/options')
                    .then(function (data) {
                        return data.data;
                    });
            },
            getDish: function (dishId) {
                return $http.get(config.apiUrl + '/menu/dishes/' + encodeURIComponent(dishId))
                    .then(function (data) {
                        return data.data;
                    })
            }
        }
    }
    )
    .service(
    'OrdersService',
    function ($http) {
        return {
            getOrder: function (orderId) {
                return $http.get(config.apiUrl + '/orders/order/' + encodeURIComponent(orderId))
                    .then(function (data) {
                        return data.data;
                    })
            },
            forKitchen: function () {
                return $http.get(config.apiUrl + '/orders/for-kitchen')
                    .then(function (data) {
                        return data.data;
                    })
            },
            setOrderReady: function (orderId) {
                return $http.post(config.apiUrl + '/orders/' + encodeURIComponent(orderId) + '/set-ready', {})
                    .then(function (data) {
                        return data.data;
                    })
            }
        }
    }
    )