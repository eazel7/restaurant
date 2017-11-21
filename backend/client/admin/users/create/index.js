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
                controller: function (user, UsersService, $state) {
                    var ctrl = this;
                    
                    ctrl.confirm = function () {
                        UsersService.create(user.name, user.roles, user.pin)
                        .then(function () {
                            $state.go('users.list');
                        })
                    };

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
                        PinLockService.askPin(function (pin) {
                            user.pin = pin;
                            
                            return $q.resolve();
                        }, true)
                     };
                }
            }
        }
    })
})