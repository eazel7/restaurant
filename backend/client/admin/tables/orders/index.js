require('angular-timeago')

require('angular')
    .module(
    (module.exports = 'restaurant.tables.orders'),
    [
        'yaru22.angular-timeago',
        require('angular-ui-router'),
        require('angular-material'),
        require('angular-material-icons'),
        require('../service'),
        require('../../orders/service'),
        require('../../menu/service')
    ]
    )
    .config(
    function ($stateProvider) {
        $stateProvider.state({
            'name': 'tables.orders',
            'url': '/orders?:table',
            resolve: {
                table: function (TablesService, $stateParams) {
                    return TablesService.getTable($stateParams.table);
                },
                orderedDishes: function (OrdersService, MenuService, table, $q) {
                    return OrdersService.listByTable(table._id)
                        .then(function (orderedDishes) {
                            return $q.all(
                                orderedDishes.map(function (orderedDish) {
                                    return MenuService.getDish(orderedDish.dish).then(function (dish) {
                                        orderedDish.dish = dish;

                                        return MenuService.listDishOptions(dish._id).then(function (options) {
                                            dish.options = options;

                                            return orderedDish;
                                        });
                                    });
                                })
                            );
                        })
                }
            },
            views: {
                'top-toolbar@': {
                    template: require('./top-toolbar.html'),
                    controller: function (orderedDishes, OrdersService, $q, $state) {

                        this.cancel = function (order) {
                            $q.all(
                                orderedDishes
                                    .filter(function (orderedDish) {
                                        return orderedDish.selected;
                                    })
                                    .map(function (orderedDish) {
                                        return OrdersService.cancel(orderedDish._id);
                                    }))
                                .then(function () {
                                    $state.reload();
                                });
                        };

                        this.reprintTicket = function () {
                            OrdersService.reprintTicket(
                                orderedDishes
                                    .filter(function (orderedDish) {
                                        return orderedDish.selected;
                                    })
                                    .map(function (orderedDish) {
                                        return orderedDish._id;
                                    })
                            )
                                .then(function () {
                                    $state.reload();
                                });
                        };
                    },
                    controllerAs: 'ctrl'
                },
                '@': {
                    template: require('./view.html'),
                    controllerAs: 'ctrl',
                    controller: function (orderedDishes, OrdersService, $state) {
                        this.orderedDishes = orderedDishes;
                    }
                }
            }
        })
    }
    ) 