require('angular')
    .module(
    (module.exports = 'restaurant.menu.dishes'),
    [
        require('./list'),
        require('./create'),
        require('./edit'),
        require('angular-ui-router')
    ]
    )
    .config(function ($stateProvider) {
        $stateProvider.state({
            name: 'menu.dishes',
            url: '/dishes',
            abstract: true
        })
    });