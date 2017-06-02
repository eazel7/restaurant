const express = require('express');

function Orders(orders) {
    var app = express.Router();
    var parseJsonBody = require('body-parser').json();

    app
        .post(
        '/order',
        parseJsonBody,
        (req, res, next) => {
            orders.orderDish(
                req.body.table,
                req.body.dish,
                req.body.optionals
            )
                .then(
                (orderId) => res.json(orderId),
                (err) => next(err || new Error())
                );
        }
        );

    app
        .get(
        '/order/:order',
        (req, res, next) => {
            orders.getOrder(req.params.order)
                .then(
                (order) => res.json(order),
                (err) => next(err || new Error()
                )
                );
        }
        );

    app.post('/:order/set-ready', function (req, res, next) {
        orders.setOrderReady(req.params.order)
            .then(() => res.json(), (err) => next(err || new Error()));
    })

    app.get('/by-table/:table', (req, res, next) => {
        orders
            .listOrderedDishesByTable(req.params.table)
            .then(
            (dishes) => res.json(dishes),
            (err) => next(err || new Error())
            );
    });

    app.get('/for-kitchen', (req, res, next) => {
        orders
            .listOrdersForKitchen()
            .then(
            (dishes) => res.json(dishes),
            (err) => next(err || new Error())
            );
    });

    return app;
};

module.exports = Orders;