const Tables = require('./tables');
const Menu = require('./menu');
const Orders = require('./orders');
const Users = require('./users');
const express = require('express');

function ApiApp(api) {
    var app = express.Router();

    app.use('/tables', new Tables(api.tables));
    app.use('/menu', new Menu(api.menu));
    app.use('/orders', new Orders(api.orders));
    app.use('/users', new Users(api.users));

    return Promise.resolve(app);
}

module.exports = ApiApp;