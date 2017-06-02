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
                    return SettingsService.getShopName();
                }
            },
            views: {
                '@': {
                    template: require('./default.html'),
                    controllerAs: 'settings',
                    controller: function (shopName) {
                        this.shopName = shopName;
                    }
                }
            }
        })  
    });