require('angular')
.module(
    (module.exports = 'restaurant.settings'),
    [
        require('angular-ui-router'),
        require('angular-material'),
        require('angular-material-icons'),
        require('./service')
    ]
)
.config(
    function ($stateProvider) {
        $stateProvider.state({
            name: 'settings',
            url: '/settings',
            resolve: {
                settings: function (SettingsService) {
                    return SettingsService.get();
                }
            },
            views: {
                '@': {
                    template: require('./default.html'),
                    controllerAs: 'settings',
                    controller: function ($scope, SettingsService, settings) {
                        var ctrl = this;

                        this.settings = settings;

                        $scope.$watch(function () {
                            return settings;
                        }, function (settings) {
                            SettingsService.set(settings);
                        }, true)
                    }
                }
            }
        })
    }
)