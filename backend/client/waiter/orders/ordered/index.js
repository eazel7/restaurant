require('angular-timeago')

require('angular')
.module(
    (module.exports = 'restaurant.orders.ordered'),
    [
        'yaru22.angular-timeago',
        require('angular-material'),
        require('angular-material-icons'),
        require('angular-ui-router'),
        require('../../order-card'),
        require('../service'),
        require('../../menu/service')
    ]
)
.config(
    function ($stateProvider) {
        $stateProvider.state({
            name: 'ordered',
            url: '/ordered',
            resolve: {
                table: function (TablesService, selectedTable) {
                    return TablesService.getTable(selectedTable).then(function (table) {
                        if (table) return table;

                        return TablesService.unsetSelected().then(function () {
                            return TableService.ensureSelected();
                        })
                    });
                },
                selectedTable: function (TablesService) {
                    return TablesService.ensureSelected();
                },
                orderedDishes: function (MenuService, OrdersService, selectedTable, $q) {
                    return OrdersService.listByTable(selectedTable)
                    .then(function (orderedDishes) {
                        return $q.all(
                            orderedDishes.map(function (orderedDish) {
                                return MenuService.getDish(orderedDish.dish).then(function(dish) {
                                    orderedDish.dish = dish;

                                    return $q.all(
                                        Object.keys(orderedDish.optionals).map(function (optionId) {
                                            var value = orderedDish.optionals[optionId];

                                            return MenuService.getDishOption(optionId)
                                            .then(function (option) {
                                                option.value = value;

                                                return option;
                                            })
                                        })
                                    )
                                    .then(function (options) {
                                        orderedDish.optionals = options;

                                        return orderedDish;
                                    });
                                });
                            })
                        )
                    })
                }
            },
            views: {
                'top-toolbar@': {
                    template: require('./top-toolbar.html'),
                    controllerAs: 'ordered',
                    controller: function (orderedDishes, table, $state) {
                        var total = 0;

                        orderedDishes.forEach(function (order) {
                            total += (order.price || 0)
                        })

                        this.table = table;

                        this.total = total;
                    }
                },
                '@': {
                    template: require('./default.html'),
                    controllerAs: 'ordered',
                    controller: function (orderedDishes, $scope, $state) {
                        this.orderedDishes = orderedDishes;

                        $scope.$on('order-ready', function () {
                            $state.reload();
                        });
                    }
                }
            }
        })
    }
)