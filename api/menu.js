function Menu(db) {
    this.dishes = db.collection('dishes');
    this.pictures = db.collection('pictures');
    this.categories = db.collection('categories');
    this.dishesOptions = db.collection('dishes-options');
}

Menu.prototype.addCategory = function (name) {
    if (!name) return Promise.reject(new Error('name is required'));

    return new Promise((resolve, reject) => {
        var id = require('shortid').generate();

        this.categories.insert({
            _id: id,
            name: name,
            dishes: []
        }, (err) => {
            if (err) return reject(err);

            resolve(id);
        });
    });
};

Menu.prototype.renameDish = function (dishId, name) {
    if (!dishId) return Promise.reject(new Error('dish id is required'));
    if (!name) return Promise.reject(new Error('name is required'));

    return new Promise(
        (resolve, reject) => {
            this.dishes.update({
                _id: dishId
            }, {
                    $set: {
                        name: name
                    }
                }, (err) => {
                    if (err) return reject(err);

                    resolve();
                });
        }
    )
};

Menu.prototype.setDishPrice = function (dishId, price) {
    if (!dishId) return Promise.reject(new Error('dish id is required'));
    if (!price) return Promise.reject(new Error('price is required'));

    price = Number(price);
    if (Number.isNaN(price) ||
        price < 0) return Promise.reject(new Error('invalid price'));

    return new Promise(
        (resolve, reject) => {
            this.dishes.update({
                _id: dishId
            }, {
                    $set: {
                        price: price
                    }
                }, (err) => {
                    if (err) return reject(err);

                    resolve();
                });
        }
    )
};

Menu.prototype.addDish = function (name) {
    if (!name) return Promise.reject(new Error('name is required'));

    return new Promise((resolve, reject) => {
        var id = require('shortid').generate();

        this.dishes.insert({
            _id: id,
            name: name,
            pictures: []
        }, (err) => {
            if (err) return reject(err);

            resolve(id);
        });
    });
};

Menu.prototype.addDishToCategory = function (dishId, categoryId) {
    if (!dishId) return Promise.reject(new Error('dish is required'));
    if (!categoryId) return Promise.reject(new Error('category is required'));

    return new Promise((resolve, reject) => {
        this.categories.findOne({
            _id: categoryId
        }, (err, doc) => {
            if (err) return reject(err);
            if (!doc) return reject(new Error('invalid category id'));

            if (doc.dishes.indexOf(dishId) === -1) {
                doc.dishes.push(dishId);

                this.categories.update({
                    _id: categoryId
                }, {
                        $set: {
                            dishes: doc.dishes
                        }
                    }, (err) => {
                        if (err) return reject(err);

                        resolve();
                    })
            } else return resolve();

        })
    });
};

Menu.prototype.removeDishFromCategory = function (dishId, categoryId) {
    if (!dishId) return Promise.reject(new Error('dish is required'));
    if (!categoryId) return Promise.reject(new Error('category is required'));

    return new Promise((resolve, reject) => {
        this.categories.findOne({
            _id: categoryId
        }, (err, doc) => {
            if (err) return reject(err);
            if (!doc) return reject(new Error('invalid category id'));

            if (doc.dishes.indexOf(dishId) === -1) return resolve();

            doc.dishes.splice(doc.dishes.indexOf(dishId), 1);

            this.categories.update({
                _id: categoryId
            }, {
                    $set: {
                        dishes: doc.dishes
                    }
                }, (err) => {
                    if (err) return reject(err);

                    resolve();
                });
        })
    });
};

Menu.prototype.getDish = function (dishId) {
    return new Promise(
        (resolve, reject) => {
            this.dishes.findOne({
                _id: dishId
            }, (err, doc) => {
                if (err) return reject(err);
                if (!doc) return reject(new Error('unkown dish id'));

                resolve(doc);
            })
        }
    )
};

Menu.prototype.getCategory = function (categoryId) {
    return new Promise(
        (resolve, reject) => {
            this.categories.findOne({
                _id: categoryId
            }, (err, doc) => {
                if (err) return reject(err);
                if (!doc) return reject(new Error('unkown category id'));

                resolve(doc);
            })
        }
    )
};

Menu.prototype.deleteCategory = function (categoryId) {
    return new Promise(
        (resolve, reject) => {
            this.categories.findOne({
                _id: categoryId
            }, (err, doc) => {
                if (err) return reject(err);
                if (!doc) return reject(new Error('unkown category id'));

                this.categories.remove({
                    _id: categoryId
                }, (err) => {
                    if (err) return reject(err);

                    resolve();
                })
            })
        }
    )
};

Menu.prototype.addDishPicture = function (dishId, picture) {
    if (!dishId) return Promise.reject(new Error('dish id is required'));
    if (!picture) return Promise.reject(new Error('picture is required'));

    return new Promise(
        (resolve, reject) => {
            this.dishes.findOne({
                _id: dishId
            }, (err, doc) => {
                if (err) return reject(err);
                if (!doc) return reject(new Error('unkown dish id'));

                var pictureId = require('shortid').generate();

                this.pictures.insert(
                    {
                        _id: pictureId,
                        contents: picture.toString('base64')
                    }, (err) => {
                        if (err) return reject(err);

                        doc.pictures.push(pictureId);
                        this.dishes.update({
                            _id: dishId
                        }, {
                                $set: {
                                    pictures: doc.pictures
                                }
                            }, (err) => {
                                if (err) return reject(err);

                                resolve();
                            })
                    })
            })
        }
    )
};

Menu.prototype.listCategories = function () {
    return new Promise((resolve, reject) => {
        this.categories.find({}).toArray((err, docs) => {
            if (err) return reject(err);

            resolve(docs);
        })
    });
};

Menu.prototype.listDishes = function () {
    return new Promise((resolve, reject) => {
        this.dishes.find({}).toArray((err, docs) => {
            if (err) return reject(err);

            resolve(docs);
        })
    });
};

Menu.prototype.listDishesByCategory = function (categoryId) {
    return new Promise((resolve, reject) => {
        this.categories.findOne({
            _id: categoryId
        }, (err, category) => {
            Promise.all(
                category.dishes.map((dishId) => {
                    return this.getDish(dishId);
                })
            )
                .then((dishes) => resolve(dishes), (err) => reject(err));
        })
    });
};

Menu.prototype.getPicture = function (pictureId) {
    if (!pictureId) return Promise.reject(new Error('picture id is required'));

    return new Promise(
        (resolve, reject) => {
            this.pictures.findOne({
                _id: pictureId
            }, (err, picture) => {
                if (err) return reject(err);

                resolve(new Buffer(picture.contents, 'base64'));
            })
        }
    )
};

Menu.prototype.listDishOptions = function (dishId) {
    if (!dishId) return Promise.reject(new Error('dish id is required'));

    return new Promise(
        (resolve, reject) => {
            this.dishesOptions.find({
                dish: dishId
            }).toArray(
                (err, docs) => {
                    if (err) return reject(err);

                    resolve(docs);
                }
                )
        }
    )
};

Menu.prototype.addDishOptionItem = function (optionId, name) {
    if (!optionId) return Promise.reject(new Error('option id is required'))
    if (!name) return Promise.reject(new Error('name is required'))

    return new Promise(
        (resolve, reject) => {
            this.dishesOptions.findOne({
                _id: optionId
            }, (err, doc) => {
                if (err) return reject(err);
                if (!doc) return reject(new Error('invalid option id'));

                doc.items.push(name);

                this.dishesOptions.update({
                    _id: optionId
                }, {
                        $set: {
                            items: doc.items
                        }
                    }, (err) => {
                        if (err) return reject(err);

                        resolve();
                    });
            })
        }
    )
};

Menu.prototype.getDishOption = function (optionId) {
    if (!optionId) return Promise.reject(new Error('option id is required'));

    return new Promise(
        (resolve, reject) => {
            this.dishesOptions.findOne({
                _id: optionId
            }, (err, doc) => {
                if (err) return reject(err);

                resolve(doc);
            });
        }
    )
};

Menu.prototype.deleteDishOption = function (optionId) {
    if (!optionId) return Promise.reject(new Error('option id is required'));

    return new Promise(
        (resolve, reject) => {
            this.dishesOptions.remove({
                _id: optionId
            }, (err) => {
                if (err) return reject(err);

                resolve();
            });
        }
    )
};

Menu.prototype.addDishOption = function (dishId, kind, name) {
    if (!dishId) return Promise.reject(new Error('dish id is required'));
    if (!kind) return Promise.reject(new Error('kind is required'));
    if (!name) return Promise.reject(new Error('name is required'));

    return new Promise(
        (resolve, reject) => {
            var id = require('shortid').generate();


            this.dishesOptions.insert({
                _id: id,
                dish: dishId,
                kind: 'select',
                items: [],
                name: name
            }, (err) => {
                if (err) return reject(err);

                if (kind === 'select') return resolve(id);

                this.addDishOptionItem(id, 'Si')
                .then(() => {
                    return this.addDishOptionItem(id, 'No');
                }, (err) => reject(err))
                .then(() => resolve(id), (err) => reject(err));
            })
        })
};

Menu.prototype.deleteDishOptionItem = function (optionId, item) {
    if (!optionId) return Promise.reject(new Error('option id is required'))
    if (!item) return Promise.reject(new Error('item is required'))

    return new Promise(
        (resolve, reject) => {
            this.dishesOptions.findOne({
                _id: optionId
            }, (err, doc) => {
                if (err) return reject(err);
                if (!doc) return reject(new Error('invalid option id'));

                doc.items.splice(doc.items.indexOf(item), 1)

                this.dishesOptions.update({
                    _id: optionId
                }, {
                        $set: {
                            items: doc.items
                        }
                    }, (err) => {
                        if (err) return reject(err);

                        resolve();
                    });
            })
        }
    )
};

module.exports = Menu;