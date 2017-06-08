const jquery = require('jquery');
const angular = require('angular');
require('angular-socket-io')
require('angular-timeago')

angular
    .module(
    (module.exports = 'restaurant'),
    [
        require('angular-material'),
        require('angular-ui-router'),
        require('./orders'),
        require('./settings'),
        require('../base/pin-lock')
    ]
    )
    .run(function ($q, PinLockService) {
        PinLockService.askPin(function (pin) {
            if (pin === '4444') return $q.resolve();
            return $q.reject('No pusiste 4444')
        })
    })
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
            'restaurant'
        ]
        )
})