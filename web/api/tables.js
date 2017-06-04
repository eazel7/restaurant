const express = require('express');
const bodyParser = require('body-parser');

function Tables(tables) {
    var app = express.Router();
    var jsonParser = bodyParser.json();

    app
        .get(
        '/:tableId',
        (req, res, next) => {
            tables.getTable(
                req.params.tableId
            )
                .then(
                (table) => res.json(table),
                (err) => next(err || new Error())
                );
        }
        );

    app
        .delete(
        '/:tableId',
        (req, res, next) => {
            tables.delete(
                req.params.tableId
            )
                .then(
                () => res.json(),
                (err) => next(err || new Error())
                );
        }
        );

    app
        .get(
        '/',
        (req, res, next) => {
            tables.list(
            )
                .then(
                (tables) => res.json(tables),
                (err) => next(err || new Error())
                );
        }
        );

    app.post('/',
        jsonParser,
        (req, res, next) => {
            tables.add(req.body.name)
                .then(
                (tableId) => res.json(tableId),
                (err) => next(err || new Error())
                )
        })

    return app;
};

module.exports = Tables;