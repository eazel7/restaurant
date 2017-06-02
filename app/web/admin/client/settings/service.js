const config = require('config');
const angular = require('angular');

angular
    .module(
    (module.exports = 'restaurant.settings.service'),
    [
    ]
    )
    .service(
    'SettingsService',
    function ($http, $q) {
        var service = {
            getShopName: function () {
                return $q.resolve(config.shopName)
            }
        }

        return service;
    }
    )