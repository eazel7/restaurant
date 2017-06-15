const angular = require('angular');

angular
    .module(
    (module.exports = 'restaurant.tables.edit'),
    [   
        require('../service')
    ]
    )
    .config(function ($stateProvider) {
        $stateProvider.state({
            name: 'tables.edit',
            url: '/edit/:table',
            resolve: {
                table: function (TablesService, $stateParams) {
                    return TablesService.getTable($stateParams.table)
                }
            },
            views: {
                'top-toolbar@': {
                    template: require('./top-toolbar.html'),
                    controllerAs: 'edit',
                    controller: function ($mdDialog, $state, table) {
                        this.setAdminMessage = function () {
                            $mdDialog.show({
                                template: require('./set-admin-message-dialog.html'),
                                controllerAs: 'dialog',
                                controller: function($state, TablesService, $mdDialog) {
                                    var ctrl = this;

                                    this.message = table.adminMessage;
                                    
                                    this.cancel = function () {
                                        $mdDialog.cancel();
                                    };

                                    this.confirm = function ()  {
                                        TablesService.setAdminMessage(
                                            table._id,
                                            ctrl.message
                                        )
                                        .then(function () {
                                            $mdDialog.hide().then(function () {
                                                $state.reload();
                                            })
                                        })
                                    }
                                }
                            })
                        };

                        this.delete = function () {
                            $mdDialog.show({
                                template: require('./delete-dialog.html'),
                                controllerAs: 'dialog',
                                controller: function (TablesService, $mdDialog) {
                                    this.cancel = function () {
                                        $mdDialog.cancel();
                                    };

                                    var working = false;

                                    this.canConfirm = function () {
                                        return !working;
                                    }

                                    this.confirm = function() {
                                        working = true;
                                        
                                        TablesService.delete(table._id)
                                        .then(function () {
                                            $mdDialog.hide();
                                        })
                                    }
                                }
                            })
                            .then(function () {
                                $state.go('^', {}, { reload: true });
                            })
                        }
                    }
                },
                '@': {
                    template: require('./default.html'),
                    controllerAs: 'edit',
                    controller: function (table) {
                        this.table = table;
                    }
                }
            }
        })  
    });