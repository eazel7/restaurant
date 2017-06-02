const express = require('express');
const ApiApp = require('./api');
const WaiterApp = require('./waiter');
const AdminApp = require('./admin');
const HomeApp = require('./home');
const KitchenApp = require('./kitchen');

function App(api) {
    return Promise.all([
        ApiApp(api),
        WaiterApp({
            apiUrl: require('config').apiUrl,
            shopName: 'Amadeo'
        }),
        AdminApp({
            apiUrl: require('config').apiUrl,
            shopName: 'Amadeo'
        }),
        KitchenApp({
            apiUrl: require('config').apiUrl
        }),
        HomeApp({
        })
    ])
        .then((results) => {
            var apiApp = results[0];

            var app = express();
            app.use('/api', results[0]);
            app.use('/waiter', results[1]);
            app.use('/admin', results[2]);
            app.use('/kitchen', results[3]);
            app.use('/', results[4]);

            return app;
        });
};

module.exports = App;