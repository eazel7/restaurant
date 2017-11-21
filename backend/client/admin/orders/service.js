var config = require('config');

require('angular')
.module(
    (module.exports = 'restaurant.orders.service'),
    [
        require('../../base/api')
    ]
)
.service(
    'OrdersService',
    function (API) {
        return API.orders;
    }
)