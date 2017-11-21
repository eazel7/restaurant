require('angular')
.module(
    (module.exports= 'restaurant.admin.users'),
    [
        require('angular-ui-router'),
        require('./list'),
        require('./create')
    ]
)
.config(function ($stateProvider) {
    $stateProvider.state({
        name: 'users',
        abstract: true,
        url: '/users'
    })
});