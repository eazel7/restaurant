require('angular')
    .module(
    (module.exports = 'restaurant.menu.categories'),
    [
        require('./create'),
        require('./list'),
        require('./edit'),
        require('angular-ui-router')
    ]
    )
    .config(function ($stateProvider) {
        $stateProvider.state({
            name: 'menu.categories',
            url: '/categories',
            abstract: true
        })
    });