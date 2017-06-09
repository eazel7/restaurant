function Users(users, bus) {
    var app = require('express').Router();
    var jsonParser = require('body-parser').json();

    app.get('/', (req, res, next) => {
        users
            .listUsers()
            .then(
            (users) => res.json(users),
            (err) => next(err || new Error())
            );
    });

    app.post('/create', jsonParser, (req, res, next) => {
        users
            .create(req.body.name, req.body.roles, req.body.pin)
            .then(
            (userId) => res.json(userId),
            (err) => next(err || new Error())
            );
    });


    app.post('/check-pin', jsonParser, (req, res, next) => {
        var userId = req.body.user;
        var pin = req.body.pin;

        users
            .checkPin(userId, pin)
            .then(
            (result) => {
                // users.get
            },
            (err) => next(err || new Error())
            );
    });

    return app;
}

module.exports = Users;