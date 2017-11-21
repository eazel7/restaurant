require('angular')
    .module(
    (module.exports = 'menu.dishes.search-dialog'),
    [
        require('angular-material'),
        require('angular-material-icons'),
        require('../../service')
    ]
    )
    .service(
    'showDishSearchDialog',
    function (
        MenuService,
        $mdDialog
    ) {
        return function (title, action, filter) {
            title = title || 'Seleccionar plato';
            filter = filter || function () { return true; };

            return MenuService.listDishes()
                .then(function (dishes) {
                    return dishes.filter(filter);
                })
                .then(function (dishes) {
                    return $mdDialog.show({
                        locals: {
                            dishes: dishes,
                            title: title,
                            action: action
                        },
                        fullscreen: true,
                        template: require('./dialog.html'),
                        controller: function (title, action, dishes, $mdDialog) {
                            this.title = title;
                            this.dishes = dishes;
                            this.select = function (dish) {
                                action(dish).then(function () {
                                    $mdDialog.hide();
                                })
                            };
                        },
                        controllerAs: 'dialog'
                    })
                });
        }
    }
    )