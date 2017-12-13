const config = require('config');
const angular = require('angular');

angular
    .module(
    (module.exports = 'restaurant.menu.service'),
    [
        require('angular-material'),
        require('../orders/service'),
        require('../../base/api')
    ]
    )
    .service(
    'MenuService',
    function (API, $mdDialog, $q, OrdersService) {
        var service = {
            setupDish: function (dishId, tableId) {
                return $q.all([
                    API.menu.getDish(dishId),
                    API.menu.listDishOptions(dishId)
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
                                var ctrl = this;

                                this.amount = 1;
                                
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
                                        optionals,
                                        ctrl.notes,
                                        ctrl.amount
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
                return API.menu.listDishOptions();
            },
            getDishOption: function (optionId) {
                return API.menu.getDishOption(optionId);
            },
            getDishOptions: function (dishId) {
                return API.menu.getDishOptions();
            },
            getDish: function (dishId) {
                return API.menu.getDish(dishId);
            },
            listCategories: function () {
                return API.menu.listCategories();
            },
            listDishesByCategory: function (category) {
                return API.menu.listDishesByCategory(category);
            }
        }

        return service;
    }
    )