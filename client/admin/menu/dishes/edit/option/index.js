const angular = require('angular');

angular
    .module(
    (module.exports = 'restaurant.menu.dishes.edit.option'),
    [
        require('../../../service')
    ]
    )
    .config(function ($stateProvider) {
        $stateProvider.state({
            name: 'menu.dishes.edit.option',
            url: '/option/:option',
            resolve: {
                option: function (MenuService, $stateParams) {
                    return MenuService.getDishOption($stateParams.option);
                },
                originalOption: function (option) {
                    return require('angular').copy(option);
                }
            },
            views: {
                '@': {
                    template: require('./default.html'),
                    controllerAs: 'option',
                    controller: function (option, $mdDialog, MenuService) {
                        this.option = option;
                        this.addItem = function () {
                            $mdDialog.show({
                                template: require('./add-item-dialog.html'),
                                controllerAs: 'dialog',
                                locals: {
                                    option: option
                                },
                                controller: function (option, MenuService, $mdDialog) {
                                    var item = this.item = {};

                                    this.cancel = function () {
                                        $mdDialog.cancel();
                                    };

                                    this.confirm = function () {
                                        MenuService
                                        .addDishOptionItem(option._id, item.name)
                                        .then(function () {
                                            return $mdDialog.hide(item.name);
                                        })
                                    }

                                    this.canConfirm = function () {
                                        return item.name;
                                    }
                                }
                            })
                            .then(function (item) {
                                option.items.push(item);
                            })
                        }
                        this.deleteItem = function (item) {
                            MenuService.deleteDishOptionItem(option._id, item)
                            .then(function () {
                                option.items.splice(option.items.indexOf(item), 1);
                            });
                        }
                    }
                },
                'top-toolbar@': {
                    template: require('./top-toolbar.html'),
                    controllerAs: 'option',
                    controller: function (option, originalOption, MenuService) {
                        this.canSave = function () {
                            return !require('angular').equals(option.name, originalOption.name);
                        };
                        
                        this.save = function () {
                            MenuService
                            .renameDishOption(option._id, option.name)
                            .then(function () {
                                $state.reload();
                            });
                        }
                    }
                }
            }
        });
    });