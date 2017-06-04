const config = require('config');
const angular = require('angular');

angular
    .module(
    (module.exports = 'restaurant.menu.service'),
    [
    ]
    )
    .service(
    'MenuService',
    function ($http) {
        var service = {
            addDishOption: function (dishId, name, kind) {
                return $http.post(config.apiUrl + '/menu/dishes/' + encodeURIComponent(dishId) + '/options', {
                    name: name,
                    kind: kind
                })
                    .then(function (data) {
                        return data.data;
                    })
            },
            addDishOptionItem: function (optionId, name) {
                return $http.post(config.apiUrl + '/menu/options/' + encodeURIComponent(optionId) + '/items', {
                    name: name
                })
                    .then(function (data) {
                        return data.data;
                    })
            },
            deleteDishOptionItem: function (optionId, item) {
                return $http.post(config.apiUrl + '/menu/options/' + encodeURIComponent(optionId) + '/items/delete', {
                    item: item
                })
                    .then(function (data) {
                        return data.data;
                    })
            },
            deleteDishOption: function (optionId) {
                return $http.delete(config.apiUrl + '/menu/options/' + encodeURIComponent(optionId))
                    .then(function (data) {
                        return data.data;
                    })
            },
            createCategory: function (name) {
                return $http.post(config.apiUrl + '/menu/categories', {
                    name: name
                })
                    .then(function (data) {
                        return data.data;
                    });
            },
            createDish: function (name) {
                return $http.post(config.apiUrl + '/menu/dishes', {
                    name: name
                })
                    .then(function (data) {
                        return data.data;
                    });
            },
            listDishOptions: function (dishId) {
                return $http.get(config.apiUrl + '/menu/dishes/' + encodeURIComponent(dishId) + '/options')
                    .then(function (data) {
                        return data.data;
                    });
            },
            getDishOption: function (optionId) {
                return $http.get(config.apiUrl + '/menu/options/' + encodeURIComponent(optionId))
                    .then(function (data) {
                        return data.data;
                    })
            },
            getDish: function (dishId) {
                return $http.get(config.apiUrl + '/menu/dishes/' + encodeURIComponent(dishId))
                    .then(function (data) {
                        return data.data;
                    });
            },
            getCategory: function (categoryId) {
                return $http.get(config.apiUrl + '/menu/categories/' + encodeURIComponent(categoryId))
                    .then(function (data) {
                        return data.data;
                    });
            },
            deleteCategory: function (categoryId) {
                return $http.delete(config.apiUrl + '/menu/categories/' + encodeURIComponent(categoryId))
                    .then(function (data) {
                        return data.data;
                    });
            },
            listCategories: function () {
                return $http.get(config.apiUrl + '/menu/categories')
                    .then(function (data) {
                        return data.data;
                    });
            },
            listDishes: function () {
                return $http.get(config.apiUrl + '/menu/dishes')
                    .then(function (data) {
                        return data.data;
                    });
            },
            listDishesByCategory: function (category) {
                return $http.get(config.apiUrl + '/menu/categories/' + encodeURIComponent(category) + '/dishes')
                    .then(function (data) {
                        return data.data;
                    });
            },
            renameDish: function (dishId, name) {
                return $http.post(
                    config.apiUrl + '/menu/dishes/' + encodeURIComponent(dishId) + '/name', 
                    {
                        name: name
                    })
                    .then(function (data) {
                        return data.data;
                    });
            },
            setDishPrice: function (dishId, price) {
                return $http.post(
                    config.apiUrl + '/menu/dishes/' + encodeURIComponent(dishId) + '/price', 
                    {
                        price: price
                    })
                    .then(function (data) {
                        return data.data;
                    });
            },
            removeDishFromCategory: function (dishId, categoryId) {
                return $http.delete(config.apiUrl + '/menu/categories/' + encodeURIComponent(categoryId) + '/dishes/' + encodeURIComponent(dishId))
                    .then(function (data) {
                        return data.data;
                    });
            },
            addDishToCategory: function (dishId, categoryId) {
                return $http.post(config.apiUrl + '/menu/categories/' + encodeURIComponent(categoryId) + '/dishes', {
                    dish: dishId
                })
                    .then(function (data) {
                        return data.data;
                    });
            }
        }

        return service;
    }
    )