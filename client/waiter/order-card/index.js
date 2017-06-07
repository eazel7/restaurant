require('angular')
.module(
    (module.exports = 'restaurant.order-card'),
    [              
        require('angular-material'),
        require('../orders/service'),
        require('../menu/service')
    ]
)
.directive(
    'orderCard',
    function () {
        return {
            template: require('./template.html'),
            scope: {
                orderId: '=',
                selected: '=',
                selectable: '='
            },
            transclude: {
                'actions': '?actions'
            },
            controllerAs: 'card',
            controller: function ($scope, OrdersService, MenuService) {
                var ctrl = this;

                $scope.$watch('orderId', function (orderId) {
                    if (!orderId) {
                        ctrl.order = null;
                        ctrl.dish = null;
                        ctrl.options = null;
                    } else {
                        OrdersService
                        .getOrder(orderId).then(function (order) {
                            ctrl.order = order;

                            return MenuService.getDish(order.dish);
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
