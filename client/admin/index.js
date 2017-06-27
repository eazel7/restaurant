const jquery = require('jquery');
const angular = require('angular');

angular
    .module(
    (module.exports = 'restaurant'),
    [
        require('angular-ui-router'),
        require('angular-material'),
        require('angular-material-icons'),
        require('../base/user-selection'),
        require('../base/api'),,
        require('angular-material-data-table')
    ]
    )
    .config(function ($mdDateLocaleProvider) {
        // Example of a Spanish localization.
        $mdDateLocaleProvider.months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        $mdDateLocaleProvider.shortMonths = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
            'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        $mdDateLocaleProvider.days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado'];
        $mdDateLocaleProvider.shortDays = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'];
        // Can change week display to start on Monday.
        $mdDateLocaleProvider.firstDayOfWeek = 1;
        // Optional.
        //$mdDateLocaleProvider.dates = [1, 2, 3, 4, 5, 6, 7,8,9,10,11,12,13,14,15,16,17,18,19,
        //                               20,21,22,23,24,25,26,27,28,29,30,31];
        // In addition to date display, date components also need localized messages
        // for aria-labels for screen-reader users.
        $mdDateLocaleProvider.weekNumberFormatter = function (weekNumber) {
            return 'Semana ' + weekNumber;
        };
        $mdDateLocaleProvider.msgCalendar = 'Calendario';
        $mdDateLocaleProvider.msgOpenCalendar = 'Abrir calendario';
    })
    .config(function ($urlRouterProvider) {
        $urlRouterProvider.otherwise('/dishes')
    })
    .run(function (API, $rootScope, $mdSidenav) {
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
            require('angular-ui-router'),
            require('./menu'),
            require('./settings'),
            require('./tables'),
            require('./users'),
            require('./stats')
        ]
        )
})