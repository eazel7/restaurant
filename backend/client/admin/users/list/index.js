require('angular')
.module(
    (module.exports = 'restaurant.admin.users.list'),
    [
        require('../service'),
        require('angular-ui-router'),
        require('angular-material'),
        require('angular-material-icons')
    ]
)
.config(function ($stateProvider) {
    $stateProvider.state({
        url: '/',
        name: 'users.list',
        resolve: {
            users: function (UsersService) {
                return UsersService.list();
            }
        },
        views: {
            'top-toolbar@': {
                template: require('./top-toolbar.html')
            },
            '@': {
                template: require('./default.html'),
                controllerAs: 'usersList',
                controller: function (users) {
                    this.users = users;
                }
            }
        }
    })
})