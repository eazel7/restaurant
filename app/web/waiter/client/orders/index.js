require('angular')
    .module(
    (module.exports = 'restaurant.orders'),
    [
        require('./place-order'),
        require('./ordered'),
        require('./service')
    ]
    );