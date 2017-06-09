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
    function (PinLockService, $http, $mdDialog) {
        var apiUrl = require('config').apiUrl;

        return {
            switchUser: function () {
                return $http.get(apiUrl + '/users')
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
                            controller: function (users) {
                                this.users = users;
                            }
                        });
                    })
            }
        }
    }
    )