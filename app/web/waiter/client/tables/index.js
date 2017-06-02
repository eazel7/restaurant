const angular = require('angular');

angular
    .module(
    (module.exports = 'restaurant.tables'),
    [   
        require('./service')
    ]
    );