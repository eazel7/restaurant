const config = require('config');
const angular = require('angular');

angular
    .module(
    (module.exports = 'restaurant.settings.service'),
    [
        require('../../base/api')
    ]
    )
    .service(
    'SettingsService',
    function (API) {
        return API.settings;
    }
    )