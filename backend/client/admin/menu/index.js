require('angular')
    .module(
    (module.exports = 'restaurant.menu'),
    [
        require('./service'),
        require('./categories'),
        require('./dishes'),
        require('angular-ui-router')
    ]
    )
    .config(function ($stateProvider) {
        $stateProvider.state({
            name: 'menu',
            url: '/menu',
            abstract: true
        })
    });