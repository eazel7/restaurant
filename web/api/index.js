const Tables = require('./tables');
const Menu = require('./menu');
const Orders = require('./orders');
const express = require('express');

function ApiApp(api) {
    var app = express.Router();

    app.use('/tables', new Tables(api.tables));
    app.use('/menu', new Menu(api.menu));
    app.use('/orders', new Orders(api.orders));

    return app;
}

module.exports = ApiApp;