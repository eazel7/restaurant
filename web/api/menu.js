const express = require('express');
const bodyParser = require('body-parser');

function Menu(menu) {
    var app = express.Router();
    var jsonParser = bodyParser.json();

    app.get('/categories', (req, res, next) => {
        menu
            .listCategories()
            .then(
            (categories) => res.json(categories),
            (err) => next(err || new Error())
            );
    });

    app.delete('/categories/:categoryId', (req, res, next) => {
        menu
            .deleteCategory(req.params.categoryId)
            .then(
            () => res.json(),
            (err) => next(err || new Error())
            );
    });

    app.get('/categories/:categoryId', (req, res, next) => {
        menu
            .getCategory(req.params.categoryId)
            .then(
            (category) => res.json(category),
            (err) => next(err || new Error())
            );
    });

    app.post('/categories',
        jsonParser,
        (req, res, next) => {
            menu
                .addCategory(req.body.name)
                .then(
                (categoryId) => res.json(categoryId),
                (err) => next(err || new Error())
                );
        });

    app.get('/categories/:category/dishes', (req, res, next) => {
        menu
            .listDishesByCategory(req.params.category)
            .then(
            (dishes) => res.json(dishes),
            (err) => next(err || new Error())
            );
    });

    app.post('/categories/:category/dishes', jsonParser, (req, res, next) => {
        menu
            .addDishToCategory(req.body.dish, req.params.category)
            .then(
            (dishes) => res.json(dishes),
            (err) => next(err || new Error())
            );
    });


    app.delete('/categories/:category/dishes/:dish', jsonParser, (req, res, next) => {
        menu
            .removeDishFromCategory(req.params.dish, req.params.category)
            .then(
            () => res.json(),
            (err) => next(err || new Error())
            );
    });

    app.get('/dishes', (req, res, next) => {
        menu
            .listDishes()
            .then(
            (dishes) => res.json(dishes),
            (err) => next(err || new Error())
            );
    });

    app.post('/dishes', jsonParser, (req, res, next) => {
        menu
            .addDish(req.body.name)
            .then(
            (dishId) => res.json(dishId),
            (err) => next(err || new Error())
            );
    });

    app.get('/dishes/:dishId', (req, res, next) => {
        menu
            .getDish(req.params.dishId)
            .then(
            (dish) => res.json(dish),
            (err) => next(err || new Error())
            );
    });

    app.post('/dishes/:dishId/name', 
    jsonParser,
    (req, res, next) => {
        menu
            .renameDish(req.params.dishId, req.body.name)
            .then(
            () => res.json(),
            (err) => next(err || new Error())
            );
    });

    app.get('/dishes/:dishId/options', (req, res, next) => {
        menu
            .listDishOptions(req.params.dishId)
            .then(
            (options) => res.json(options),
            (err) => next(err || new Error())
            );
    });

    app.post('/dishes/:dishId/options', jsonParser, (req, res, next) => {
        menu
            .addDishOption(req.params.dishId, req.body.kind, req.body.name)
            .then(
            (optionId) => res.json(optionId),
            (err) => next(err || new Error())
            );
    });

    app.get('/options/:optionId', (req, res, next) => {
        menu
            .getDishOption(req.params.optionId)
            .then(
            (option) => res.json(option),
            (err) => next(err || new Error())
            )
    })

    app.delete('/options/:optionId', (req, res, next) => {
        menu
            .deleteDishOption(req.params.optionId)
            .then(
            () => res.json(),
            (err) => next(err || new Error())
            )
    })

    app.post('/options/:optionId/items', jsonParser, (req, res, next) => {
        menu
            .addDishOptionItem(req.params.optionId, req.body.name)
            .then(
            () => res.json(),
            (err) => next(err || new Error())
            )
    })


    app.post('/options/:optionId/items/delete', jsonParser, (req, res, next) => {
        menu
            .deleteDishOptionItem(req.params.optionId, req.body.item)
            .then(
            () => res.json(),
            (err) => next(err || new Error())
            )
    })

    app.get('/pictures/:pictureId', (req, res, next) => {
        menu
            .getPicture(req.params.pictureId)
            .then(
            (buffer) => {
                res.write(buffer);
                res.end();
            },
            (err) => next(err || new Error())
            );
    });

    return app;
};

module.exports = Menu;