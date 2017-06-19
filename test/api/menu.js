const TingoDB = require('tingodb')({ memStore: true });
const Db = TingoDB.Db;
const Menu = require('../../api/menu');
const assert = require('assert');

describe('Menu', function () {
    var db;
    var target;

    beforeEach(function (done) {
        db = new Db('test', {});
        target = new Menu(db);

        require('async')
            .series([
                (callback) => db.collection('categories').insert({
                    _id: 'category1',
                    name: 'Category 1',
                    dishes: ['dish1']
                }, callback),
                (callback) => db.collection('dishes').insert({
                    _id: 'dish1',
                    name: 'Dish 1',
                    pictures: []
                }, callback),
                (callback) => db.collection('dishes').insert({
                    _id: 'dish2',
                    name: 'Dish 2',
                    pictures: ['picture1']
                }, callback),
                (callback) => db.collection('dishes-options').insert({
                    _id: 'dish2-option1',
                    name: 'Option 1',
                    dish: 'dish2',
                    kind: 'bool',
                    items: ['item2']
                }, callback),
                (callback) => db.collection('pictures').insert({
                    _id: 'picture1',
                    contents: (new Buffer('my-picture-data')).toString('base64')
                }, callback)
            ],
            (err) => done(err));
    });

    describe('.listDishesByCategory', function () {
        it('resolves dishes in category1', function (done) {
            target.listDishesByCategory('category1').then(function (categories) {
                try {
                    assert.deepEqual([{
                        _id: 'dish1',
                        name: 'Dish 1',
                        pictures: []
                    }], categories)

                    done();
                } catch (e) {
                    done(e);
                }
            })
        });
    });

    describe('.listDishes', function () {
        it('resolves dishes', function (done) {
            target.listDishes().then(function (dishes) {
                try {
                    assert.deepEqual([{
                        _id: 'dish1',
                        name: 'Dish 1',
                        pictures: []
                    }, {
                        _id: 'dish2',
                        name: 'Dish 2',
                        pictures: ['picture1']
                    }], dishes)

                    done();
                } catch (e) {
                    done(e);
                }
            })
        });
    });

    describe('.getDish', function () {
        it('resolves dish', function (done) {
            target.getDish('unkonwndish').then(() => done(new Error()),
                (err) => {
                    try {
                        assert(err);
                        assert(err instanceof Error);
                        assert.equal(err.message, 'unkown dish id');

                        done();
                    } catch (e) {
                        done(e);
                    }
                })
        });

        it('resolves dish', function (done) {
            target.getDish('dish1').then(function (dish) {
                try {
                    assert.deepEqual({
                        _id: 'dish1',
                        name: 'Dish 1',
                        pictures: []
                    }, dish)

                    done();
                } catch (e) {
                    done(e);
                }
            })
        });
    });

    describe('.getCategory', function () {
        it('rejects unknown category id', function (done) {
            target.getCategory('unkowncategory').then(() => done(new Error()),
                (err) => {
                    try {
                        assert(err);
                        assert(err instanceof Error);
                        assert.equal(err.message, 'unkown category id');

                        done();
                    } catch (e) {
                        done(e);
                    }
                })
        });

        it('resolves category', function (done) {
            target.getCategory('category1').then(function (category) {
                try {
                    assert.deepEqual(category, {
                        _id: 'category1',
                        name: 'Category 1',
                        dishes: ['dish1']
                    })

                    done();
                } catch (e) {
                    done(e);
                }
            })
        });
    });

    describe('.deleteCategory', function () {
        it('rejects unknown category id', function (done) {
            target.deleteCategory('unkowncategory').then(() => done(new Error()),
                (err) => {
                    try {
                        assert(err);
                        assert(err instanceof Error);
                        assert.equal(err.message, 'unkown category id');

                        done();
                    } catch (e) {
                        done(e);
                    }
                })
        });

        it('deletes from db', function (done) {
            target.deleteCategory('category1').then(function () {
                db.collection('categories').findOne({
                    _id: 'category1'
                }, (err, doc) => {
                    try {
                        assert.ifError(err);
                        assert(!doc);

                        done();
                    } catch (e) {
                        done(e)
                    }
                })
            })
        });
    });

    describe('.listCategories', function () {
        it('resolves categories', function (done) {
            target.listCategories().then(function (categories) {
                try {
                    assert.deepEqual([{
                        _id: 'category1',
                        name: 'Category 1',
                        dishes: ['dish1']
                    }], categories)

                    done();
                } catch (e) {
                    done(e);
                }
            })
        });
    });

    describe('.addCategory', function () {
        it('requires name', function (done) {
            target.addCategory().then(
                () => done(new Error()),
                (err) => {
                    try {
                        assert(err);
                        assert(err instanceof Error);
                        assert.equal(err.message, 'name is required');

                        done();
                    } catch (e) {
                        done(e);
                    }
                }
            );
        });

        it('saves to db', function (done) {
            target.addCategory('Category 2').then(
                (id) => {
                    try {
                        assert(id);
                        assert(typeof (id), 'string');

                        db.collection('categories').findOne({
                            _id: id
                        }, (err, doc) => {
                            try {
                                assert.ifError(err);
                                assert.deepEqual(doc,
                                    {
                                        _id: id,
                                        name: 'Category 2',
                                        dishes: []
                                    })

                                done();
                            } catch (e) {
                                done(e);
                            }
                        })
                    } catch (e) {
                        done(e);
                    }
                }
            );
        });
    });

    describe('.addDish', function () {
        it('requires name', function (done) {
            target.addDish().then(
                () => done(new Error()),
                (err) => {
                    try {
                        assert(err);
                        assert(err instanceof Error);
                        assert.equal(err.message, 'name is required');

                        done();
                    } catch (e) {
                        done(e);
                    }
                }
            );
        });

        it('saves to db', function (done) {
            target.addDish('Dish 2').then(
                (id) => {
                    try {
                        assert(id);
                        assert(typeof (id), 'string');

                        db.collection('dishes').findOne({
                            _id: id
                        }, (err, doc) => {
                            try {
                                assert.ifError(err);
                                assert(doc);
                                assert.equal(doc.name, 'Dish 2')

                                done();
                            } catch (e) {
                                done(e);
                            }
                        })
                    } catch (e) {
                        done(e);
                    }
                }
            );
        });
    });

    describe('.renameDish', function () {
        it('requires dish id', function (done) {
            target.renameDish().then(
                () => done(new Error()),
                (err) => {
                    try {
                        assert(err);
                        assert(err instanceof Error);
                        assert.equal(err.message, 'dish id is required');

                        done();
                    } catch (e) {
                        done(e);
                    }
                }
            );
        });

        it('requires name', function (done) {
            target.renameDish('dish1').then(
                () => done(new Error()),
                (err) => {
                    try {
                        assert(err);
                        assert(err instanceof Error);
                        assert.equal(err.message, 'name is required');

                        done();
                    } catch (e) {
                        done(e);
                    }
                }
            );
        });

        it('saves to db', function (done) {
            target.renameDish('dish1', 'renamed').then(
                () => {

                    db.collection('dishes').findOne({
                        _id: 'dish1'
                    }, (err, doc) => {
                        try {
                            assert.ifError(err);
                            assert(doc);
                            assert.equal(doc.name, 'renamed')

                            done();
                        } catch (e) {
                            done(e);
                        }
                    })
                }
            );
        });
    });

    describe('.removeDishPicture', () => {
        it('requires dish id', (done) => {
            target.removeDishPicture()
                .then(
                () => done(new Error()),
                (err) => {
                    try {
                        assert(err);
                        assert(err instanceof Error);
                        assert.equal(err.message, 'dish id is required');

                        done();
                    } catch (e) {
                        done(e);
                    }
                }
                );
        });
        it('requires picture id', (done) => {
            target.removeDishPicture('dish1')
                .then(
                () => done(new Error()),
                (err) => {
                    try {
                        assert(err);
                        assert(err instanceof Error);
                        assert.equal(err.message, 'picture id is required');

                        done();
                    } catch (e) {
                        done(e);
                    }
                }
                );
        });

        it('removes picture from list', (done) => {

            target.removeDishPicture('dish2', 'picture1')
                .then(
                () => {
                    db.collection('dishes').findOne({
                        _id: 'dish1'
                    }, (err, doc) => {
                        try {
                            assert.ifError(err);
                            assert(doc);
                            assert.deepEqual(doc.pictures, []);
                            
                            done();
                        } catch (e) {
                            done(e);
                        }
                    })
                }
                );
        });
    });

    describe('.addDishPicture', function () {
        it('requires dish', function (done) {
            target.addDishPicture().then(
                () => done(new Error()),
                (err) => {
                    try {
                        assert(err);
                        assert(err instanceof Error);
                        assert.equal(err.message, 'dish id is required');

                        done();
                    } catch (e) {
                        done(e);
                    }
                }
            );
        });

        it('requires picture', function (done) {
            target.addDishPicture('dish1').then(
                () => done(new Error()),
                (err) => {
                    try {
                        assert(err);
                        assert(err instanceof Error);
                        assert.equal(err.message, 'picture is required');

                        done();
                    } catch (e) {
                        done(e);
                    }
                }
            );
        });

        it('saves to database', function (done) {
            target.addDishPicture('dish1', new Buffer('my-picture-data')).then(
                () => {
                    require('async')
                        .autoInject({
                            'dish': (callback) => {
                                db.collection('dishes').findOne({
                                    _id: 'dish1'
                                }, (err, doc) => callback(err, doc));
                            },
                            pictureId: (dish, callback) => {
                                try {
                                    assert(dish.pictures);
                                    assert(dish.pictures[0]);

                                    callback(null, dish.pictures[0]);
                                } catch (e) {
                                    callback(e);
                                }
                            },
                            picture: (pictureId, callback) => {
                                db.collection('pictures').findOne({ _id: pictureId }, (err, picture) => {
                                    try {
                                        assert.ifError(err);
                                        assert(picture);
                                        assert(picture.contents);

                                        assert.equal((new Buffer(picture.contents, 'bas64')).toString(),
                                            'my-picture-data');

                                        callback();
                                    } catch (e) {
                                        callback();
                                    }
                                })
                            }
                        }
                        , (err) => done(err));
                }
            );
        });
    });

    describe('.addDishToCategory', function () {
        it('requires dish', function (done) {
            target.addDishToCategory().then(
                () => done(new Error()),
                (err) => {
                    try {
                        assert(err);
                        assert(err instanceof Error);
                        assert.equal(err.message, 'dish is required');

                        done();
                    } catch (e) {
                        done(e);
                    }
                }
            );
        });

        it('requires category', function (done) {
            target.addDishToCategory('dish1').then(
                () => done(new Error()),
                (err) => {
                    try {
                        assert(err);
                        assert(err instanceof Error);
                        assert.equal(err.message, 'category is required');

                        done();
                    } catch (e) {
                        done(e);
                    }
                }
            );
        });

        it('rejects invalid category', function (done) {
            target.addDishToCategory('dish1', 'invalidcategory').then(
                () => done(new Error()),
                (err) => {
                    try {
                        assert(err);
                        assert(err instanceof Error);
                        assert.equal(err.message, 'invalid category id');

                        done();
                    } catch (e) {
                        done(e);
                    }
                }
            );
        });

        it('saves to db', function (done) {
            target.addDishToCategory('dish2', 'category1').then(
                () => {
                    try {
                        db.collection('categories').findOne({
                            _id: 'category1'
                        }, (err, doc) => {
                            try {
                                assert.ifError(err);
                                assert(doc);
                                assert.deepEqual(doc.dishes, ['dish1', 'dish2']);

                                done();
                            } catch (e) {
                                done(e);
                            }
                        })
                    } catch (e) {
                        done(e);
                    }
                }
            );
        });

        it('does nothing if already in category', function (done) {
            target.addDishToCategory('dish1', 'category1').then(
                () => {
                    try {
                        db.collection('categories').findOne({
                            _id: 'category1'
                        }, (err, doc) => {
                            try {
                                assert.ifError(err);
                                assert(doc);
                                assert.deepEqual(doc.dishes, ['dish1']);

                                done();
                            } catch (e) {
                                done(e);
                            }
                        })
                    } catch (e) {
                        done(e);
                    }
                }
            );
        });
    });


    describe('.removeDishFromCategory', function () {
        it('requires dish', function (done) {
            target.removeDishFromCategory().then(
                () => done(new Error()),
                (err) => {
                    try {
                        assert(err);
                        assert(err instanceof Error);
                        assert.equal(err.message, 'dish is required');

                        done();
                    } catch (e) {
                        done(e);
                    }
                }
            );
        });

        it('requires category', function (done) {
            target.removeDishFromCategory('dish1').then(
                () => done(new Error()),
                (err) => {
                    try {
                        assert(err);
                        assert(err instanceof Error);
                        assert.equal(err.message, 'category is required');

                        done();
                    } catch (e) {
                        done(e);
                    }
                }
            );
        });

        it('rejects invalid category', function (done) {
            target.removeDishFromCategory('dish1', 'invalidcategory').then(
                () => done(new Error()),
                (err) => {
                    try {
                        assert(err);
                        assert(err instanceof Error);
                        assert.equal(err.message, 'invalid category id');

                        done();
                    } catch (e) {
                        done(e);
                    }
                }
            );
        });

        it('saves to db', function (done) {
            target.removeDishFromCategory('dish1', 'category1').then(
                () => {
                    try {
                        db.collection('categories').findOne({
                            _id: 'category1'
                        }, (err, doc) => {
                            try {
                                assert.ifError(err);
                                assert(doc);
                                assert.deepEqual(doc.dishes, []);

                                done();
                            } catch (e) {
                                done(e);
                            }
                        })
                    } catch (e) {
                        done(e);
                    }
                }
            );
        });

        it('does nothing if already in category', function (done) {
            target.removeDishFromCategory('dish2', 'category1').then(
                () => {
                    try {
                        db.collection('categories').findOne({
                            _id: 'category1'
                        }, (err, doc) => {
                            try {
                                assert.ifError(err);
                                assert(doc);
                                assert.deepEqual(doc.dishes, ['dish1']);

                                done();
                            } catch (e) {
                                done(e);
                            }
                        })
                    } catch (e) {
                        done(e);
                    }
                }
            );
        });
    });

    describe('.setDishPrice', function () {
        it('requires dish', function (done) {
            target.setDishPrice().then(
                () => done(new Error()),
                (err) => {
                    try {
                        assert(err);
                        assert(err instanceof Error);
                        assert.equal(err.message, 'dish id is required');

                        done();
                    } catch (e) {
                        done(e);
                    }
                }
            );
        });

        it('requires price', function (done) {
            target.setDishPrice('dish1').then(
                () => done(new Error()),
                (err) => {
                    try {
                        assert(err);
                        assert(err instanceof Error);
                        assert.equal(err.message, 'price is required');

                        done();
                    } catch (e) {
                        done(e);
                    }
                }
            );
        });

        it('rejects invalid price', function (done) {
            target.setDishPrice('dish1', -2).then(
                () => done(new Error()),
                (err) => {
                    try {
                        assert(err);
                        assert(err instanceof Error);
                        assert.equal(err.message, 'invalid price');

                        done();
                    } catch (e) {
                        done(e);
                    }
                }
            );
        });

        it('saves to db', function (done) {
            target.setDishPrice('dish1', 30).then(
                () => {
                    try {
                        db.collection('dishes').findOne({
                            _id: 'dish1'
                        }, (err, doc) => {
                            try {
                                assert.ifError(err);
                                assert(doc);
                                assert.equal(doc.price, 30);

                                done();
                            } catch (e) {
                                done(e);
                            }
                        })
                    } catch (e) {
                        done(e);
                    }
                }
            );
        });
    });

    describe('.getPicture', function () {
        it('requires picture id', function (done) {
            target.getPicture().then(
                () => done(new Error()),
                (err) => {
                    try {
                        assert(err);
                        assert(err instanceof Error);
                        assert.equal(err.message, 'picture id is required');

                        done();
                    } catch (e) {
                        done(e);
                    }
                }
            )
        })

        it('returns picture buffer', function (done) {
            target.getPicture('picture1').then(
                (buffer) => {
                    try {
                        assert(buffer);
                        assert(buffer instanceof Buffer);
                        assert.equal(buffer.toString(), 'my-picture-data');

                        done();
                    } catch (e) {
                        done(e);
                    }
                }
            )
        })
    })

    describe('.getDishOption', function () {
        it('requires option id', function (done) {
            target.getDishOption().then(() => done(new Error()),
                (err) => {
                    try {
                        assert(err);
                        assert(err instanceof Error);
                        assert.equal(err.message, 'option id is required');

                        done();
                    } catch (e) {
                        done(e);
                    }
                })
        })

        it('resolves option', function (done) {
            target.getDishOption('dish2-option1').then(
                (option) => {
                    try {
                        assert.deepEqual(option,
                            {
                                _id: 'dish2-option1',
                                name: 'Option 1',
                                dish: 'dish2',
                                kind: 'bool',
                                items: ['item2']
                            });

                        done();
                    } catch (e) {
                        done(e);
                    }
                }
            );
        })
    })

    describe('.deleteDishOption', function () {
        it('requires option id', function (done) {
            target.deleteDishOption().then(() => done(new Error()),
                (err) => {
                    try {
                        assert(err);
                        assert(err instanceof Error);
                        assert.equal(err.message, 'option id is required');

                        done();
                    } catch (e) {
                        done(e);
                    }
                })
        })

        it('removes from db', function (done) {
            target.deleteDishOption('dish2-option1').then(
                () => {
                    db.collection('dishes-options').findOne({
                        _id: 'dish2-option1'
                    }, (err, doc) => {
                        try {
                            assert.ifError(err);
                            assert(!doc);

                            done();
                        } catch (e) {
                            done(e);
                        }
                    })
                }
            );
        })
    })

    describe('.addDishOptionItem', function () {
        it('requires option id', function (done) {
            target.addDishOptionItem().then(
                () => done(new Error()),
                (err) => {
                    try {
                        assert(err);
                        assert(err instanceof Error);
                        assert.equal(err.message, 'option id is required');

                        done();
                    } catch (e) {
                        done(e);
                    }
                }
            )
        });

        it('requires name', function (done) {
            target.addDishOptionItem('dish2-option1').then(
                () => done(new Error()),
                (err) => {
                    try {
                        assert(err);
                        assert(err instanceof Error);
                        assert.equal(err.message, 'name is required');

                        done();
                    } catch (e) {
                        done(e);
                    }
                }
            );
        });

        it('saves to db', function (done) {
            target.addDishOptionItem('dish2-option1', 'item 1').then(
                () => {
                    db.collection('dishes-options').findOne({
                        _id: 'dish2-option1'
                    }, (err, doc) => {
                        try {
                            assert.ifError(err);
                            assert(doc);
                            assert.deepEqual(doc.items, ['item2', 'item 1']);

                            done();
                        } catch (e) {
                            done(e);
                        }
                    })
                }
            );
        })
    })

    describe('deleteDishOptionItem', function () {
        it('requires option id', function (done) {
            target.deleteDishOptionItem().then(
                () => done(new Error()),
                (err) => {
                    try {
                        assert(err);
                        assert(err instanceof Error);
                        assert.equal(err.message, 'option id is required');

                        done();
                    } catch (e) {
                        done(e);
                    }
                }
            )
        });

        it('requires item', function (done) {
            target.deleteDishOptionItem('dish2-option1').then(
                () => done(new Error()),
                (err) => {
                    try {
                        assert(err);
                        assert(err instanceof Error);
                        assert.equal(err.message, 'item is required');

                        done();
                    } catch (e) {
                        done(e);
                    }
                }
            );
        });

        it('saves to db', function (done) {
            target.deleteDishOptionItem('dish2-option1', 'item2').then(
                () => {
                    db.collection('dishes-options').findOne({
                        _id: 'dish2-option1'
                    }, (err, doc) => {
                        try {
                            assert.ifError(err);
                            assert(doc);
                            assert.deepEqual(doc.items, []);

                            done();
                        } catch (e) {
                            done(e);
                        }
                    })
                }
            );
        })
    })

    describe('.addDishOption', function () {
        it('requires dish id', function (done) {
            target.addDishOption().then(() => done(new Error()),
                (err) => {
                    try {
                        assert(err);
                        assert(err instanceof Error);
                        assert.equal(err.message, 'dish id is required');

                        done();
                    } catch (e) {
                        done(e);
                    }
                })
        })

        it('requires kind', function (done) {
            target.addDishOption('dish1').then(() => done(new Error()),
                (err) => {
                    try {
                        assert(err);
                        assert(err instanceof Error);
                        assert.equal(err.message, 'kind is required');

                        done();
                    } catch (e) {
                        done(e);
                    }
                })
        })

        it('requires name', function (done) {
            target.addDishOption('dish1', 'bool').then(() => done(new Error()),
                (err) => {
                    try {
                        assert(err);
                        assert(err instanceof Error);
                        assert.equal(err.message, 'name is required');

                        done();
                    } catch (e) {
                        done(e);
                    }
                })
        })

        it('saves bool as select with Si/No option items', function (done) {
            target.addDishOption('dish1', 'bool', 'Option 1').then((id) => {
                try {
                    assert(id);

                    db.collection('dishes-options').findOne({
                        _id: id
                    }, (err, doc) => {
                        try {
                            assert.ifError(err);
                            assert(doc);
                            assert.deepEqual(doc, {
                                _id: id,
                                dish: 'dish1',
                                name: 'Option 1',
                                kind: 'select',
                                items: [
                                    'Si',
                                    'No'
                                ]
                            })

                            done();
                        } catch (e) {
                            done(e)
                        }
                    })
                } catch (e) {
                    done(e);
                }
            },
                (err) => done(err || new Error()))
        })
    })

    describe('.listDishOptions', function () {
        it('requires dish id', function (done) {
            target.listDishOptions().then(() => done(new Error()),
                (err) => {
                    try {
                        assert(err);
                        assert(err instanceof Error);
                        assert.equal(err.message, 'dish id is required');

                        done();
                    } catch (e) {
                        done(e);
                    }
                })
        })

        it('resolves list', function (done) {
            target.listDishOptions('dish2').then((options) => {
                try {
                    assert.deepEqual(options, [
                        {
                            _id: 'dish2-option1',
                            dish: 'dish2',
                            name: 'Option 1',
                            kind: 'bool',
                            items: ['item2']
                        }
                    ])

                    done();
                } catch (e) {
                    done(e);
                }
            })
        })
    })
})