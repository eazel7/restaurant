const express = require('express');
const ApiApp = require('./api');
const WaiterApp = require('./waiter');
const AdminApp = require('./admin');
const HomeApp = require('./home');
const KitchenApp = require('./kitchen');

function App(api) {
    var app = express();

    var apiApp = new ApiApp(api);

    app.use('/api', apiApp);

    var waiterApp = new WaiterApp({
        apiUrl: require('config').apiUrl,
        shopName: 'Amadeo'
    });

    app.use('/waiter', waiterApp);

    var adminApp = new AdminApp({
        apiUrl: require('config').apiUrl,
        shopName: 'Amadeo'
    });

    app.use('/admin', adminApp);

    var kitchenApp = new KitchenApp({
        apiUrl: require('config').apiUrl
    });
    app.use('/kitchen', kitchenApp);

    var homeApp = new HomeApp({});
    app.use('/', homeApp);

    return app;
};

module.exports = App;