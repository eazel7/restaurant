require('angular')
.module(
    (module.exports = 'restaurant.kitchen.settings'),
    [
        require('angular-material'),
        require('angular-material-icons'),
        require('angular-ui-router')
    ]
)
.config(
    function ($stateProvider) {
        $stateProvider.state({
            'name': 'settings',
            'views': {
                '@': {
                    'template': require('./default.html'),
                    'controllerAs': 'settings',
                    'controller': function (SettingsService, $scope) {
                        var ctrl = this;

                        this.volume = SettingsService.get('volume', 100);

                        $scope.$watch(function () { return ctrl.volume; }, function (volume) {
                            SettingsService.set('volume', volume);
                        });
                    }
                }
            }
        })
    }
)