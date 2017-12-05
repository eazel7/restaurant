const angular = require('angular');

angular
    .module(
    (module.exports = 'restaurant.tables'),
    [   
        require('./service'),
        require('./edit'),
        require('./create'),
        require('./ordered'),
        require('./cancel-orders')
    ]
    )
    .config(function ($stateProvider) {
        $stateProvider.state({
            name: 'tables',
            url: '/tables',
            resolve: {
                tables: function (TablesService) {
                    return TablesService.list();
                }
            },
            views: {
                'top-toolbar@': {
                    template: require('./top-toolbar.html')
                },
                '@': {
                    template: require('./default.html'),
                    controllerAs: 'tables',
                    controller: function (tables) {
                        this.tables = tables;
                    }
                }
            }
        })  
    });