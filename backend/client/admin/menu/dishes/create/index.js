const angular = require('angular');

angular
    .module(
    (module.exports = 'restaurant.menu.dishes.create'),
    [
        require('../../service')
    ]
    )
    .config(function ($stateProvider) {
        $stateProvider.state({
            name: 'menu.dishes.create',
            url: '/create',
            resolve: {
                dish: function () {
                    return {};
                }
            },
            views: {
                'top-toolbar@': {
                    template: require('./top-toolbar.html'),
                    controllerAs: 'create',
                    controller: function ($mdDialog, $state, MenuService, dish) {
                        var working = false;

                        this.canConfirm = function () {
                            if (working) return false;

                            return dish.name;
                        };

                        this.confirm = function () {
                            working = true;

                            MenuService.createDish(dish.name)
                            .then(function (dishId) {
                                $state.go('^.edit', { dish: dishId})
                            });
                        }
                    }
                },
                '@': {
                    template: require('./default.html'),
                    controllerAs: 'create',
                    controller: function (dish) {
                        this.dish = dish;
                    }
                }
            }
        })
    });