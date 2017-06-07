const angular = require('angular');

angular
    .module(
    (module.exports = 'restaurant.menu.categories.create'),
    [   
        require('../../service')
    ]
    )
    .config(function ($stateProvider) {
        $stateProvider.state({
            name: 'menu.categories.create',
            url: '/create',
            resolve: {
                category: function () {
                    return {};
                }
            },
            views: {
                'top-toolbar@': {
                    template: require('./top-toolbar.html'),
                    controllerAs: 'create',
                    controller: function (category, MenuService, $state) {
                        this.confirm = function () {
                            MenuService.createCategory(
                                category.name
                            )
                            .then(function () {
                                $state.go('^.list', {},  { reload: true });
                            });
                        };
                        this.canConfirm = function () {
                            return category && category.name;
                        };
                    }
                },
                '@': {
                    template: require('./default.html'),
                    controllerAs: 'create',
                    controller: function (category) {
                        this.category = category;
                    }
                }
            }
        })  
    });