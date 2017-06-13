const angular = require('angular');
const config = require('config');

angular
    .module(
    (module.exports = 'restaurant.tables.service'),
    [
        require('angular-material'),
        require('angular-ui-router'),
        require('../../base/api')
    ]
    )
    .service(
    'TablesService',
    function (API, $q, $mdDialog) {
        var service = {
            ensureSelected: function () {
                return service.getSelected().then(function (current) {
                    if (current) return current;

                    var defer = $q.defer();

                    service.list().then(function (tables) {

                        $mdDialog.show({
                            controllerAs: 'dialog',
                            controller: function (tables, $mdDialog) {
                                this.tables = tables;
                                this.select = function (id) {
                                    $mdDialog.hide(id);
                                }
                            },
                            locals: {
                                tables: tables
                            },
                            clickOutsideToClose: false,
                            escapeToClose: false,
                            fullscreen: true,
                            template: require('./select-table-dialog.html')
                        })
                            .then(function (id) {
                                service.setSelected(id);

                                defer.resolve(id);
                            })
                    });

                    return defer.promise;
                });
            },
            getSelected: function () {
                return $q.resolve(window.localStorage.selectedTable);
            },
            unsetSelected: function () {
                delete window.localStorage.selectedTable;

                return $q.resolve();
            },
            setSelected: function (id) {
                window.localStorage.selectedTable = id;

                return $q.resolve(id);
            },
            list: function () {
                return API.tables.list();
            },
            getTable: function (tableId) {
                return API.tables.getTable(tableId);
            }
        };

        return service;
    }
    );