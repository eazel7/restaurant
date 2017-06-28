require('angular-simple-logger');
require('ui-leaflet');

require('angular')
.module(
    (module.exports = 'restaurant.phone-orders.new-order'),
    [
        require('angular-material'),
        require('angular-ui-router'),
        require('angular-material-icons'),
        'nemLogging',
        'ui-leaflet'
    ]
)
.config(
    function (
        $stateProvider,
        $urlRouterProvider
    ) {
        $urlRouterProvider.otherwise('/new-order');
        $stateProvider.state({
            name: 'new-order',
            url: '/new-order',
            views: {
                '@': {
                    template: require('./default.html')
                }
            }
        })
    }
)