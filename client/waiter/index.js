const jquery = require('jquery');
const angular = require('angular');
require('angular-socket-io')

angular
    .module(
    (module.exports = 'restaurant'),
    [
        'btford.socket-io',
        require('angular-material'),
        require('./tables/service')
    ]
    )
    .factory('socket', function (socketFactory) {
        return socketFactory();
    })
    .controller(
    'LeftSidenavController',
    function (TablesService, socket, $state, $mdSidenav) {
        var ctrl = this;

        ctrl.selectTable = function (table) {
            TablesService.setSelected(table._id)
                .then(function () {
                    $state.go('place-order', {}, { reload: true }).then(function () {
                        $mdSidenav('left').close();
                    })
                })
        }

        var refreshTables = function () {
            return TablesService.list().then(function (tables) {
                ctrl.tables = tables;
            });
        };

        refreshTables().then(function () {
            socket.on('table-status-changed', function (tableId) {
                refreshTables();
            });
        });
    }
    )
    .run(function ($rootScope, socket) {
        socket.on('order-ready', function (orderId) {
            $rootScope.$broadcast('order-ready', orderId);
        });
    })
    .run(function ($rootScope, $mdSidenav) {
        $rootScope.$on('$stateChangeSuccess', function () {
            $mdSidenav('left').close();
        })
    })
    .controller(
    'BaseToolbarController',
    function ($mdSidenav, $rootScope, $state) {
        this.toggleSidenav = function () {
            $mdSidenav('left').toggle();
        };

        var previousStateStack = [];

        $rootScope.$on('$stateChangeSuccess', function (event, currentState, currentStateParams, previousState, previousStateParams) {
            if (!currentState || !currentState.name) return;

            previousStateStack.push({
                name: currentState.name,
                params: require('angular').copy(currentStateParams)
            });
        })

        $rootScope.$on('$stateChangeError', function (event, currentState, currentStateParams, previousState, previousStateParams, error) {
            throw error;
        })

        this.goBack = function () {
            if (!previousStateStack.length) return;

            var previousState = previousStateStack.slice(-2)[0];
            var index = previousStateStack.length - 2;

            $state.go(previousState.name, previousState.params).then(function () {
                previousStateStack.splice(index, 2);
            });
        };

        this.canGoBack = function () {
            return previousStateStack.length > 1;
        }
    }
    )
    .config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('lime')
            .accentPalette('amber');
    });


jquery(document).ready(function () {
    angular
        .bootstrap(
        document,
        [
            'restaurant',
            require('./orders'),
            require('./settings')
        ]
        )
});