require('angular')
    .module(
    (module.exports = 'restaurant.menu.dishes.list'),
    [
        require('../../service'),
        require('angular-ui-router'),
        require('angular-material'),
        require('angular-material-icons')
    ]
    )
    .config(function ($stateProvider) {
        $stateProvider.state({
            name: 'menu.dishes.list',
            url: '/',
            resolve: {
                dishes: function (MenuService) {
                    return MenuService.listDishes();
                }
            },
            views: {
                'top-toolbar@': {
                    template: require('./top-toolbar.html')
                },
                '@': {
                    template: require('./default.html'),
                    controllerAs: 'menu',
                    controller: function (dishes) {
                        this.dishes = dishes;
                    }
                }
            }
        })
    });