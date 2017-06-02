const angular = require('angular');

angular
    .module(
    (module.exports = 'restaurant.tables.create'),
    [   
        require('../service')
    ]
    )
    .config(function ($stateProvider) {
        $stateProvider.state({
            name: 'tables.create',
            url: '/create',
            resolve: {
                table: function () {
                    return {};
                }
            },
            views: {
                'top-toolbar@': {
                    template: require('./top-toolbar.html'),
                    controllerAs: 'create',
                    controller: function (table, TablesService, $state) {
                        this.confirm = function () {
                            TablesService.create(
                                table.name
                            )
                            .then(function () {
                                $state.go('^', {}, { reload: true });
                            });
                        };
                        this.canConfirm = function () {
                            return table && table.name;
                        };
                    }
                },
                '@': {
                    template: require('./default.html'),
                    controllerAs: 'create',
                    controller: function (table) {
                        this.table = table;
                    }
                }
            }
        })  
    });