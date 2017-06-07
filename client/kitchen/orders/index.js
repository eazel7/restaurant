require('angular')
.module(
    (module.exports = 'restaurant.kitchen.orders'),
    [
        require('angular-material'),
        require('angular-material-icons'),
        require('angular-ui-router'),
        require('../../base/speech'),
        'btford.socket-io',
        'yaru22.angular-timeago',
        require('../service'),
        require('../order-card'),
        require('../../base/notifications'),
        require('../settings/service')
    ]
)
    .factory('socket', function (socketFactory) {
        return socketFactory();
    })
    .run(function (socket, $rootScope) {
        socket.on('new-dish-ordered', function (orderId) {
            $rootScope.$broadcast('new-dish-ordered', orderId);
        })
    })
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider.state({
            'name': 'orders',
            'url': '/',
            'views': {
                '@': {
                    'template': require('./default.html'),
                    controller: 'KitchenOrdersController',
                    controllerAs: 'kitchen'
                }
            }
        });
    })
    .controller(
    'KitchenOrdersController',
    function (OrdersService, $scope, SettingsService, SpeechService, NotificationsService, TablesService, MenuService, socket, $q) {
        var ctrl = this;

        var refreshOrders = function () {
            return OrdersService.forKitchen().then(function (orders) {
                return $q.all(
                    orders.map(function (order) {
                        return MenuService.getDish(order.dish)
                            .then(function (dish) {
                                order.dish = dish;

                                return order;
                            })
                            .then(function (order) {
                                return TablesService.getTable(order.table).then(function (table) {
                                    order.table = table;

                                    return order;
                                })
                            })
                    })
                );
            })
                .then(function (orders) {
                    ctrl.orders = orders;
                });
        }

        this.setOrdersReady = function (orders) {
            $q.all(
                orders.map(function (order) {
                    return OrdersService.setOrderReady(order._id);
                })
            )
                .then(function () {
                    return refreshOrders();
                })
        };

        refreshOrders()
            .then(function () {
                $scope.$on('new-dish-ordered', function (event, orderId) {
                    OrdersService.getOrder(orderId).then(function (order) {
                        MenuService.getDish(order.dish).then(function (dish) {
                            NotificationsService.showNotification('Nuevo pedido: ' + dish.name);

                            var volume = SettingsService.get('volume', 100) / 100;
                            
                            if (volume) SpeechService.speak('es-US', 'Nuevo pedido, ' + dish.name, volume);
                        })
                    });
                    refreshOrders();
                })
            })
    }
    )