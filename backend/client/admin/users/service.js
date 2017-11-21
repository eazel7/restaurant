require('angular')
    .module(
    (module.exports = 'restaurant.admin.users.service'),
    [
        require('../../base/api')
    ]
    )
    .service(
    'UsersService',
    function (API) {
        return API.users;
    }
    )