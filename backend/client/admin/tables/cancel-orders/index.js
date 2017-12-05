require('angular')
    .module(
    (module.exports = 'restaurant.tables.cancel-orders'),
    [
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
            'name': 'tables.cancel-orders',
            'url': '/cancel-orders?:table',
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
                    template: ''
                },
                '@': {
                    template: require('./view.html'),
                    controllerAs: 'ctrl',
                    controller: function (orderedDishes) {
                        this.orderedDishes = orderedDishes;
                    }
                }   
            }
        })
    }
    ) 