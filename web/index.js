const express = require('express');
const ApiApp = require('./api');
const WaiterApp = require('./waiter');
const AdminApp = require('./admin');
const HomeApp = require('./home');
const KitchenApp = require('./kitchen');

function App(api) {
    return Promise.all([
        WaiterApp({
            apiUrl: require('config').apiUrl,
            shopName: 'Amadeo'
        },
        api),
        AdminApp({
            apiUrl: require('config').apiUrl,
            shopName: 'Amadeo'
        },
        api),
        KitchenApp({
            apiUrl: require('config').apiUrl
        }, 
        api),
        HomeApp({
        })
    ])
        .then((results) => {
            var app = express();

            app.use((req, res, next) => {
                var token =req.headers['token'];
                
                if (token) api.users.decodeToken(token).then(
                    (profile) => {
                        req.profile = profile;
                         
                        next();
                    },
                    (err) => next(err)
                );
                else next();
            });

            app.use('/waiter', results[0]);
            app.use('/admin', results[1]);
            app.use('/kitchen', results[2]);
            app.use('/', results[3]);

            return app;
        });
};

module.exports = App;