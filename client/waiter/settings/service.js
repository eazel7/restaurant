require('angular')
.module(
    (module.exports = 'restaurant.settings.service'),
    []
)
.service(
    'SettingsService',
    function ($q, $window) {
        var defaultSettings = {
            showPhotos: true
        };
        
        return {
            get: function () {
                try {
                    var current = JSON.parse($window.localStorage.settings) || {};

                    return $q.resolve(current);
                } catch (e) {
                    return $q.resolve(defaultSettings);
                }
            },
            set: function (newSettings) {
                $window.localStorage.settings = JSON.stringify(newSettings);

                return $q.resolve();
            }
        }
    }
)