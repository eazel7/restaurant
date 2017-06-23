require('angular')
    .module(
    (module.exports = 'restaurant.admin.stats'),
    [
        require('angular-material'),
        require('angular-material-icons'),
        require('angular-ui-router'),
        require('../../base/api')
    ]
    )
    .config(
    function ($stateProvider) {
        $stateProvider.state({
            name: 'stats',
            url: '/stats',
            views: {
                '@': {
                    template: require('./default.html'),
                    controllerAs: 'stats',
                    controller: function ($mdMedia, API, $q) {
                        var ctrl = this;

                        var date = new Date();
                        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

                        this.from = firstDay;
                        this.to = lastDay;

                        this.isXs = function () {
                            return $mdMedia('xs');
                        };

                        this.query = function (from, to) {
                            API
                                .stats
                                .listOrdersBetweenDates(
                                from.valueOf(),
                                to.valueOf()
                                ).then(function (results) {
                                    ctrl.results = results;

                                    var byDish = {};

                                    results.forEach(function (order) {
                                        (byDish[order.dish] = byDish[order.dish] || [])
                                        .push(order);
                                    });

                                    $q.all(
                                        Object.keys(byDish).map(function (dishId) {
                                            return API.menu.getDish(dishId).then(function (dish) {
                                                dish.amount = byDish[dishId].length;

                                                return dish;
                                            })
                                        })
                                    )
                                    .then(function (byDish) {
                                        ctrl.byDish = byDish;
                                    })
                                })
                        };
                    }
                }
            }
        })
    }
    )