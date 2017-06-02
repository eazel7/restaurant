require('angular')
    .module(
    (module.exports = 'restaurant.home'),
    [
        require('angular-material'),
        require('angular-ui-router')
    ]
    )
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        
        $stateProvider.state({
            name: 'home',
            url: '/',
            views: {
                '@': {
                    template: require('./default.html')
                }
            }
        })  
    });