const jquery = require('jquery');
const angular = require('angular');
require('angular-socket-io')
require('angular-timeago')

angular
    .module(
    (module.exports = 'restaurant.phone-orders'),
    [
        require('angular-material'),
        require('angular-ui-router')
    ]
    )
    .config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('lime')
            .accentPalette('amber');
    })


jquery(document).ready(function () {
    angular
        .bootstrap(
        document,
        [
            'restaurant.phone-orders',
            require('./new-order')
        ]
        )
})