require('angular')
.module(
    (module.exports = 'restaurants.users.create'),
    [
        require('../../../base/pin-lock'),
        require('../service'),
        require('angular-ui-router'),
        require('angular-material'),
        require('angular-material-icons')
    ]
)
.config(function ($stateProvider) {
    $stateProvider.state({
        name: 'users.create',
        url:'/create',
        resolve: {
            user: function () {
                return {
                    name: '',
                    roles: [],
                    pin: null
                }
            }
        },
        views: {
            'top-toolbar@': {
                'template': require('./top-toolbar.html'),
                controllerAs: 'toolbar',
                controller: function (user) {
                    var ctrl = this;
                    
                    ctrl.canConfirm = function () {
                        return user.roles.length > 0 && user.name && user.pin;
                    }
                }
            },
            '@': {
                template: require('./default.html'),
                controllerAs: 'createUser',
                controller: function (UsersService, user, PinLockService, $q) {
                     var ctrl = this;

                     this.user = user;
                     this.setPin = function () {
                        PinLockService.askPin(function () {
                            return $q.resolve();
                        }, true)
                        .then(function (pin) {
                            user.pin = pin;
                        })
                     };
                }
            }
        }
    })
})