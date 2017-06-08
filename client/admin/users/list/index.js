require('angular')
.module(
    (module.exports = 'restaurant.admin.users.list'),
    [
        require('angular-ui-router'),
        require('angular-material'),
        require('angular-material-icons')
    ]
)
.config(function ($stateProvider) {
    $stateProvider.state({
        url: '/',
        name: 'users.list',
        views: {
            'top-toolbar@': {
                template: require('./top-toolbar.html')
            },
            '@': {
                template: require('./default.html')
            }
        }
    })
})