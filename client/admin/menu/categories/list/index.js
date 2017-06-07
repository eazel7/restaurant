require('angular')
    .module(
    (module.exports = 'restaurant.menu.categories.list'),
    [
        require('../../service'),
        require('angular-ui-router'),
        require('angular-material'),
        require('angular-material-icons')
    ]
    )
    .config(function ($stateProvider) {
        $stateProvider.state({
            name: 'menu.categories.list',
            url: '/',
            resolve: {
                categories: function (MenuService) {
                    return MenuService.listCategories();
                }
            },
            views: {
                'top-toolbar@': {
                    template: require('./top-toolbar.html')
                },
                '@': {
                    template: require('./default.html'),
                    controllerAs: 'menu',
                    controller: function (categories) {
                        this.categories = categories;
                    }
                }
            }
        })
    });