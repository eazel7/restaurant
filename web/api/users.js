function Users(users, bus) {
    var app = require('express').Router();

    app.get('/', (req, res, next) => {
        users.listUsers().then((users) => res.json(users), (err) => next(err || new Error()));
    })

    return app;
}

module.exports = Users;