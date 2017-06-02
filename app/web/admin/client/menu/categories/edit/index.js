const angular = require('angular');

angular
    .module(
    (module.exports = 'restaurant.menu.categories.edit'),
    [
        require('../../service'),
        require('../../dishes/search-dialog')
    ]
    )
    .config(function ($stateProvider) {
        $stateProvider.state({
            name: 'menu.categories.edit',
            url: '/:category/edit',
            resolve: {
                category: function (MenuService, $stateParams) {
                    return MenuService.getCategory($stateParams.category)
                },
                dishesInCategory: function (MenuService, $stateParams) {
                    return MenuService.listDishesByCategory($stateParams.category);
                }
            },
            views: {
                'top-toolbar@': {
                    template: require('./top-toolbar.html'),
                    controllerAs: 'edit',
                    controller: function ($mdDialog, $state, MenuService, category, dishesInCategory, showDishSearchDialog) {
                        this.addDish = function () {
                            showDishSearchDialog(
                                'Agregar un plato',
                                function (dish) {
                                    return MenuService.addDishToCategory(dish._id, category._id)
                                        .then(function () {
                                            dishesInCategory.push(dish);
                                        })
                                },
                                function (dish) {
                                    for (var i = 0; i < dishesInCategory.length; i++) {
                                        if (dishesInCategory[i]._id === dish._id) return false;
                                    }

                                    return true;
                                });
                        };
                        this.delete = function () {
                            $mdDialog.show({
                                template: require('./delete-dialog.html'),
                                controllerAs: 'dialog',
                                controller: function (MenuService, $mdDialog) {
                                    this.cancel = function () {
                                        $mdDialog.cancel();
                                    };

                                    var working = false;

                                    this.canConfirm = function () {
                                        return !working;
                                    }

                                    this.confirm = function () {
                                        working = true;

                                        MenuService.deleteCategory(category._id)
                                            .then(function () {
                                                $mdDialog.hide();
                                            })
                                    }
                                }
                            })
                                .then(function () {
                                    $state.go('^.list', {}, { reload: true });
                                })
                        }
                    }
                },
                '@': {
                    template: require('./default.html'),
                    controllerAs: 'edit',
                    controller: function (category, dishesInCategory, MenuService) {
                        this.category = category;
                        this.dishesInCategory = dishesInCategory;

                        this.removeDish = function (dish) {
                            return MenuService.removeDishFromCategory(dish._id, category._id)
                                .then(function () {
                                    dishesInCategory.splice(dishesInCategory.indexOf(dish), 1);
                                })
                        };

                    }
                }
            }
        })
    });