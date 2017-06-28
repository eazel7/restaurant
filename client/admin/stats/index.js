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
    .factory(
        'computeOrdersByCustomer', 
        function (API, $q) {
            return function (orders) {
                var defer = $q.defer();
                
                var dishesIds = []

                orders.forEach(function (order) {
                    if (dishesIds.indexOf(order.dish) === -1) dishesIds.push(order.dish);
                });

                var dishes = {};

                $q.all(
                    dishesIds.map(function (dishId) {
                        return API.menu.getDish(dishId).then(function (dish) {
                            dishes[dishId] = dish;
                        })
                    })
                )
                .then(function () {
                    var customersIds = [];

                    orders.forEach(function (order) {
                        if (order.customer && customersIds.indexOf(order.customer) === -1) customersIds.push(order.customer);
                    });

                    var customers = {};

                    $q.all(
                        customersIds.map(function (customerId) {
                            return API.customers.get(customerId).then(function (customer) {
                                customers[customerId] = customer;
                            })
                        })
                    )
                    .then(function () {
                        var results = [];

                        for (var customerId in customers) {
                            var row = customers[customerId];

                            row.orders = orders.filter(function (order) {
                                return order.customer === customerId;
                            });

                            row.totalSold = 0;
                            row.totalPortions = 0;
                            row.totalOrders = row.orders.length;

                            row.orders.forEach(function (order) {
                                if (Number.isNaN(dishes[order.dish].price)) return;

                                row.totalPortions += (order.amount || 1); 
                                row.totalSold += ((order.amount || 1) * (dishes[order.dish].price || 0));
                            })  

                            results.push(row)
                        }

                        defer.resolve(results);
                    })
                });

                return defer.promise;
            }
        }
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
                    controller: function ($mdMedia, API, $q, computeOrdersByCustomer) {
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
                            var toPlusOneDay = new Date(ctrl.to);
                            toPlusOneDay.setDate(toPlusOneDay.getDate() + 1);

                            API
                                .stats
                                .listOrdersBetweenDates(
                                from.valueOf(),
                                toPlusOneDay.valueOf()
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
                                            .then(function (dish) {
                                                var spans = [];

                                                byDish[dishId].forEach(function (order) {
                                                    if (order.date && order.readyAt) {
                                                        var orderDate = (typeof(order.date) === 'string') ? Date.parse(order.date) : new Date(order.date);
                                                        var readyDate = (typeof(order.readyDate) === 'string') ? Date.parse(order.readyAt) : new Date(order.readyAt);

                                                        spans.push((readyDate.valueOf() - orderDate.valueOf()));
                                                    }
                                                });
                                                var totalTime = 0;

                                                spans.forEach(function (span) {
                                                    totalTime += span;
                                                });

                                                var average = totalTime / spans.length;

                                                dish.average = average;
                                                dish.totalSold = dish.amount * dish.price;

                                                return dish;
                                            })
                                        })
                                    )
                                    .then(function (byDish) {
                                        ctrl.byDish = byDish;
                                    })

                                    computeOrdersByCustomer(results).then(function (byCustomer) {
                                        ctrl.byCustomer = byCustomer;
                                    });
                                })
                        };
                    }
                }
            }
        })
    }
    )