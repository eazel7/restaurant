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
.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('lime')
    .accentPalette('amber');
});


jquery(document).ready(function () {
    angular
    .bootstrap(
        document,
        [
            'restaurant'
        ]
    )
})