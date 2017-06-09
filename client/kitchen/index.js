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
        require('../base/user-selection')
    ]
    )
    .run(function ($q, UserSelectionService) {
        UserSelectionService.switchUser();
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