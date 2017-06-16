require('angular')
    .module(
    (module.exports = 'restaurant.settings'),
    [
        require('./service'),
        require('angular-material'),
        require('angular-ui-router')
    ]
    )
    .config(function ($stateProvider) {
        $stateProvider.state({
            name: 'settings',
            url: '/settings',
            resolve: {
                shopName: function (SettingsService) {
                    return SettingsService.get('shop-name');
                },
                location: function (SettingsService) {
                    return SettingsService.get('location');
                },
                settings: function (shopName, location) {
                    return {
                        shopName: shopName || '',
                        location: location || {}
                    }
                }
            },
            views: {
                'top-toolbar@': {
                    template: require('./top-toolbar.html'),
                    controllerAs: 'toolbar',
                    controller: function ($q, settings, SettingsService, $state) {
                        this.save = function () {
                            $q.all([
                                SettingsService.set('shop-name', settings.shopName),
                                SettingsService.set('location', settings.location)
                            ])
                            .then(function () {
                                $state.reload();
                            });
                        }
                    }
                },
                '@': {
                    template: require('./default.html'),
                    controllerAs: 'ctrl',
                    controller: function (settings) {
                        this.settings = settings;
                    }
                }
            }
        })  
    });