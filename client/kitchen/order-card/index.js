require('angular-timeago');

require('angular')
.module(
    (module.exports = 'restaurant.order-card'),
    [              
        require('angular-material'),
        require('../service'),
        'yaru22.angular-timeago'
    ]
)
.directive(
    'orderCard',
    function () {
        return {
            template: require('./template.html'),
            scope: {
                orderId: '=',
                selected: '='
            },
            controllerAs: 'card',
            controller: function ($scope, OrdersService, TablesService, MenuService) {
                var ctrl = this;

                $scope.$watch('orderId', function (orderId) {
                    if (!orderId) {
                        ctrl.order = null;
                        ctrl.dish = null;
                        ctrl.options = null;
                    } else {
                        OrdersService
                        .getOrder(orderId)
                        .then(function (order) {
                            ctrl.order = order;

                            return MenuService
                            .getDish(order.dish)
                            .then(function (dish) {
                                return TablesService
                                .getTable(order.table)
                                .then(function (table) {
                                    ctrl.table = table;

                                    return dish;
                                });
                            })
                        })
                        .then(function (dish) {
                            ctrl.dish = dish;

                            return MenuService.getDishOptions(dish._id);
                        })
                        .then(function (dishOptions) {
                            ctrl.options = dishOptions;

                            
                        })
                    }
                })
            }
        }
    }
)
