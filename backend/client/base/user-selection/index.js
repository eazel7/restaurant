require('angular')
    .module(
    (module.exports = 'restaurant.user-selection'),
    [
        require('angular-material'),
        require('angular-material-icons'),
        require('../pin-lock')
    ]
    )
    .service(
    'UserSelectionService',
    function (PinLockService, $http, $mdDialog, $q) {
        var apiUrl = require('config').apiUrl;

        var checkPin = function (userId, pin) {
            return $http
                .post(apiUrl + '/users/check-pin', { user: userId, pin: pin })
                .then(function (data) {
                    return data.data;
                });
        };

        return {
            switchUser: function () {
                var defer = $q.defer();

                $http.get(apiUrl + '/users')
                    .then(function (data) {
                        return data.data;
                    })
                    .then(function (users) {
                        $mdDialog.show({
                            locals: {
                                users: users
                            },
                            template: require('./user-selection-dialog.html'),
                            controllerAs: 'dialog',
                            fullscreen: true,
                            controller: function (users, $mdDialog) {
                                this.users = users;

                                this.select = function (user) {
                                    $mdDialog.hide(user);
                                }
                            }
                        })
                        .then(function (user) {
                            return PinLockService.askPin(function (pin) {
                                return checkPin(user._id, pin);
                            })
                        })
                    })

                return defer.promise;
            }
        }
    }
    );