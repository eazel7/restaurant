const config = require('config');
const angular = require('angular');

angular
    .module(
    (module.exports = 'restaurant.menu.service'),
    [
        require('angular-material'),
        require('../orders/service')
    ]
    )
    .service(
    'MenuService',
    function ($http, $mdDialog, $q, OrdersService) {
        var service = {
            setupDish: function (dishId, tableId) {
                return $q.all([
                    service.getDish(dishId),
                    service.listDishOptions(dishId)
                ])
                    .then(function (results) {
                        var dish = results[0];
                        var options = results[1];

                        return $mdDialog.show({
                            template: require('./setup-dish-dialog.html'),
                            fullscreen: true,
                            locals: {
                                dish: dish,
                                options: options,
                                tableId: tableId
                            },
                            controllerAs: 'dialog',
                            controller: function (dish, options, tableId, $mdDialog) {
                                this.cancel = function () {
                                    $mdDialog.cancel();
                                }
                                this.dish = dish;
                                this.options = options;
                                var optionals = this.selected = {};

                                this.options.filter(function (option) {
                                    return option.kind === 'select';
                                }).forEach(function (option) {
                                    optionals[option._id] = option.items[0];
                                })

                                this.confirm = function () {
                                    OrdersService.placeOrder(
                                        tableId,
                                        dishId,
                                        optionals
                                    )
                                    .then(function (orderId) {
                                        $mdDialog.hide(orderId);
                                    })
                                }
                            }
                        })
                    });
            },
            listDishOptions: function (dishId) {
                return $http.get(config.apiUrl + '/menu/dishes/' + encodeURIComponent(dishId) + '/options')
                    .then(function (data) {
                        return data.data;
                    });
            },
            getDishOption: function (optionId) {
                return $http.get(config.apiUrl + '/menu/options/' + encodeURIComponent(optionId))
                .then(function (data) {
                    return data.data;
                })
            },
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
                    });
            },
            listCategories: function () {
                return $http.get(config.apiUrl + '/menu/categories')
                    .then(function (data) {
                        return data.data;
                    });
            },
            listDishesByCategory: function (category) {
                return $http.get(config.apiUrl + '/menu/categories/' + encodeURIComponent(category) + '/dishes')
                    .then(function (data) {
                        return data.data;
                    });
            }
        }

        return service;
    }
    )