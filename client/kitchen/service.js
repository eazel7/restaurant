require('angular')
    .module(
    (module.exports = 'restaurant.kitchen.service'),
    [
        require('../base/api')
    ]
    )
    .service(
    'TablesService',
    function (API) {
        return API.tables;
    })
    .service(
    'MenuService',
    function (API) {
        return API.menu;
    }
    )
    .service(
    'OrdersService',
    function (API) {
        return API.orders;
    }
    );