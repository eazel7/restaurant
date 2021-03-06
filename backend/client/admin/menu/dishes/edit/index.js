const angular = require('angular');

angular
    .module(
    (module.exports = 'restaurant.menu.dishes.edit'),
    [
        require('../../service'),
        require('./option'),
        require('../../../../base/file-button'),
        require('../../../../base/pictures-carousel')
    ]
    )
    .config(function ($stateProvider) {
        $stateProvider.state({
            name: 'menu.dishes.edit',
            url: '/:dish/edit',
            resolve: {
                dish: function (MenuService, $stateParams) {
                    return MenuService.getDish($stateParams.dish)
                },
                originalDish: function (dish) {
                    return require('angular').copy(dish);
                },
                optionals: function (MenuService, $stateParams) {
                    return MenuService.listDishOptions($stateParams.dish);
                }
            },
            views: {
                'top-toolbar@': {
                    template: require('./top-toolbar.html'),
                    controllerAs: 'edit',
                    controller: function ($mdDialog, $state, dish, originalDish, MenuService) {
                        this.canSave = function () {
                            return !require('angular').equals(dish, originalDish);
                        };

                        this.save = function () {
                            MenuService
                                .renameDish(dish._id, dish.name)
                                .then(function () {
                                    return MenuService.setDishPrice(dish._id, dish.price)
                                });
                        }
                    }
                },
                '@': {
                    template: require('./default.html'),
                    controllerAs: 'edit',
                    controller: function (dish, optionals, $mdDialog, MenuService, $scope) {
                        var ctrl = this;

                        this.optionals = optionals;
                        this.dish = dish;

                        this.mapPictureUrl = function (pictureId) {
                            return '/admin/picture/' + encodeURIComponent(pictureId);
                        };

                        this.deleteCurrentPicture = function () {
                            var pictureId = ctrl.currentPicture;

                            MenuService.removeDishPicture(dish._id, pictureId)
                            .then(function () {
                                dish.pictures.splice(dish.pictures.indexOf(pictureId), 1)
                            });
                        }

                        this.photoUpload = function (url, data) {
                            MenuService
                                .addDishPicture(dish._id, data)
                                .then(function (pictureId) {
                                    dish.pictures.push(pictureId);
                                });
                        };

                        this.addOptional = function () {
                            $mdDialog.show({
                                template: require('./add-optional-dialog.html'),
                                locals: {
                                    dish: dish
                                },
                                controllerAs: 'dialog',
                                controller: function (MenuService, dish, $mdDialog) {
                                    this.cancel = function () {
                                        $mdDialog.cancel();
                                    };

                                    var working = false;

                                    var option = this.option = {
                                        kind: 'bool'
                                    };

                                    this.canConfirm = function () {
                                        if (working) return false;

                                        return option.name;
                                    };

                                    this.confirm = function () {
                                        working = true;

                                        MenuService.addDishOption(dish._id, option.name, option.kind)
                                            .then(function (optionId) {
                                                $mdDialog.hide({
                                                    _id: optionId,
                                                    dish: dish._id,
                                                    name: option.name,
                                                    kind: option.kind
                                                });
                                            })
                                    }
                                }
                            })
                                .then(function (option) {
                                    optionals.push(option);
                                })
                        };

                        this.deleteOptional = function (optional) {
                            MenuService.deleteDishOption(optional._id)
                                .then(function () {
                                    optionals.splice(optionals.indexOf(optional), 1);
                                });
                        };
                    }
                }
            }
        })
    });