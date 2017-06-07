const jquery = require('jquery');
const angular = require('angular');


angular
    .module(
    (module.exports = 'restaurant'),
    [
        require('angular-material'),
        require('angular-material-icons')
    ]
    )
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
            require('./home'),
            require('./menu'),
            require('./settings'),
            require('./tables')
        ]
        )
})