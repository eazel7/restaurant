const jquery = require('jquery');
const angular = require('angular');
require('angular-socket-io')
require('angular-timeago')

angular
    .module(
    (module.exports = 'restaurant'),
    [
        require('angular-material'),
        require('angular-material-icons'),
        'btford.socket-io',
        'yaru22.angular-timeago',
        require('./service'),
        require('./order-card'),    
        require('./notifications')
    ]
    )
    .factory('socket', function (socketFactory) {
        return socketFactory();
    })
    .config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('lime')
            .accentPalette('amber');
    })
    .controller(
    'KitchenOrdersController',
    function (OrdersService, NotificationsService, TablesService, MenuService, socket, $q) {
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
                socket.on('new-dish-ordered', function (orderId) {
                    OrdersService.getOrder(orderId).then(function (order) {
                        MenuService.getDish(order.dish).then(function (dish) {
                            NotificationsService.showNotification('Nuevo pedido: ' + dish.name)
                        })
                    });
                    refreshOrders();
                })
            })
    }
    )


jquery(document).ready(function () {
    angular
        .bootstrap(
        document,
        [
            'restaurant'
        ]
        )
})