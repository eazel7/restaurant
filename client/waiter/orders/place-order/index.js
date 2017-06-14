const angular = require('angular');
const config = require('config');

angular
    .module(
    (module.exports = 'restaurant.orders.place-order'),
    [
        require('angular-ui-router'),
        require('angular-material'),
        require('angular-material-icons'),
        require('../../menu'),
        require('../../tables')
    ]
    )
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider.state({
            name: 'place-order',
            url: '/',
            resolve: {
                showPhotos: function (SettingsService) {
                    return SettingsService.get().then(function (settings) {
                        return settings.showPhotos;
                    });
                },
                table: function (TablesService, selectedTable) {
                    return TablesService.getTable(selectedTable).then(function (table) {
                        if (table) return table;

                        return TablesService.unsetSelected().then(function () {
                            return TablesService.ensureSelected();
                        })
                    });
                },
                selectedTable: function (TablesService) {
                    return TablesService.ensureSelected();
                },
                categories: function (MenuService, $q) {
                    return MenuService.listCategories().then(function (categories) {
                        return $q.all(
                            categories.map(function (category) {
                                return MenuService.listDishesByCategory(category._id).then(function (dishes) {
                                    category.dishes = dishes;

                                    dishes.forEach(function (dish) {
                                        dish.pictureUrls = dish.pictures.map(function (pictureId) {
                                            return config.apiUrl + '/menu/pictures/' + encodeURIComponent(pictureId);
                                        })
                                    })

                                    return category;
                                })
                            })
                        )
                    })
                }
            },
            views: {
                'top-toolbar@': {
                    template: require('./top-toolbar.html'),
                    controllerAs: 'placeOrder',
                    controller: function (table) {
                        this.table = table
                    }
                },
                'fab@': {
                    template: require('./fab.html'),
                    controllerAs: 'placeOrder',
                    controller: function (table) {
                        this.table = table
                    }
                },
                '@': {
                    template: require('./default.html'),
                    controllerAs: 'placeOrder',
                    controller: function (categories, table, showPhotos, MenuService) {
                        this.categories = categories;
                        this.table = table;
                        this.showPhotos = showPhotos;

                        this.addDish = function (dish) {
                            MenuService.setupDish(dish._id, table._id);
                        }

                        this.pictureUrl = function (pictureId) {
                            return config.apiUrl + '/menu/pictures/' + encodeURIComponent(pictureId);
                        }
                    }
                }
            }
        })
    })