require('angular')
.module(
    (module.exports = 'restaurant.orders.place-order.set-customer'),
    [
        require('angular-material'),
        require('angular-material-icons'),
        require('angular-ui-router'),
        require('../../../tables/service'),
        require('../../../../base/api')
    ]
)
.config(
    function ($stateProvider) {
        $stateProvider.state(
            {
                name: 'place-order.set-customer',
                resolve: {
                    table: function (TablesService) {
                        return TablesService.ensureSelected();
                    }
                },
                onEnter: function ($mdDialog, $state) {
                    $mdDialog.show({
                        template: require('./dialog.html'),
                        controllerAs: 'dialog',
                        fullscreen: true,
                        controller: function (API, $mdDialog) {
                            var ctrl = this;

                            this.searchCustomers = function (filter) {
                                return API.customers.search(filter);
                            };

                            this.create = function () {
                                API.customers.create(ctrl.searchText)
                                .then(function (customerId) {
                                    $mdDialog.hide(customerId);
                                });
                            };

                            this.useSelected = function () {
                                $mdDialog.hide(ctrl.selected._id);
                            };
                        }
                    })
                    .then(function () {
                        //TODO: setear el cliente para la mesa
                        $state.go('place-order');
                    },function () {
                        $state.go('place-order');
                    })
                }
            }
        )
    }
)