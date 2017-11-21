require('angular')
    .module(
    (module.exports = 'restaurant.kitchen.settings.service'),
    [
        require('../../base/api')
    ]
    )
    .service(
    'SettingsService',
    function ($window, API) {
        return {
            getIpAddresses: function () {
                return API.settings.getIpAddresses();
            },
            get: function (key, defaultValue) {
                try {
                    var current = JSON.parse($window.localStorage.kitchenSettings) || {};

                    if (key in current) return current[key];
                    else return defaultValue;
                } catch (e) {
                    return;
                }
            },
            set: function (key, value) {
                var current = {};
                
                try {
                    current = JSON.parse($window.localStorage.kitchenSettings) || {};
                } catch (e) {
                }

                current[key] = value;

                $window.localStorage.kitchenSettings = JSON.stringify(current);
            }
        }
    }
    )