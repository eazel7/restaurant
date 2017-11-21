const angular = require('angular');
const config = require('config');

angular
    .module(
    (module.exports = 'restaurant.tables.service'),
    [
        require('../../base/api')
    ]
    )
    .service(
    'TablesService',
    function (API) {
        return API.tables;
    }
    );