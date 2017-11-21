const config = require('config');
const angular = require('angular');

angular
    .module(
    (module.exports = 'restaurant.printer.service'),
    [
        require('../../base/api')
    ]
    )
    .service(
    'PrinterService',
    function (API) {
        return API.printer;
    }
    );