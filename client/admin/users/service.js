require('angular')
    .module(
    (module.exports = 'restaurant.admin.users.service'),
    []
    )
    .service(
    'UsersService',
    function ($http) {
        var apiUrl = require('config').apiUrl;

        return {
            list: function () {
                return $http.get(apiUrl + '/users').then(function (data) {
                    return data.data;
                })
            },
            create: function (name, roles, pin) {
                return $http.post(apiUrl + '/users', {
                    name: name,
                    roles: roles,
                    pin: pin
                })
                .then(function (data) {
                    return data.data;
                })
            }
        }
    }
    )
';./'