const config = require('config');
const angular = require('angular');

angular
    .module(
    (module.exports = 'restaurant.menu.service'),
    [
    ]
    )
    .service(
    'MenuService',
    function (API) {
        return API.menu;
    }
    )