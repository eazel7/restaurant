const Db = require('tingodb')({ memStore: true }).Db;
const Orders = require('../../api/orders');
const assert = require('assert');
const EventEmitter = require('events').EventEmitter;

describe('Orders', function () {
    var db;
    var bus;
    var target;

    beforeEach(function (done) {
        db = new Db('test', {});
        bus = new EventEmitter();
        bus.setMaxListeners(0);

        target = new Orders(db, bus);

        require('async')
            .series([
                (callback) => db.collection('categories').insert({
                    _id: 'category1',
                    name: 'Category 1'
                }, callback),
                (callback) => db.collection('dishes').insert({
                    _id: 'dish1',
                    name: 'Dish 1',
                    category: 'category1',
                    price: 30
                }, callback),
                (callback) => db.collection('tables').insert({
                    _id: 'table1',
                    name: 'Table 1'
                }, callback),
                (callback) => db.collection('orders').insert({
                    _id: 'order2'
                }, callback)
            ],
            (err) => done(err));
    });

    describe('.setOrderReady', function () {
        it('requires order id', (done) => {
            target.setOrderReady()
                .then(
                () => done(new Error()),
                (err) => {
                    try {
                        assert(err);
                        assert(err instanceof Error);
                        assert.equal(err.message, 'order id is required');

                        done();
                    } catch (e) {
                        done(e);
                    }
                }
                )
        });

        beforeEach((done) => {
            db.collection('orders').insert({
                _id: 'order1',
                dish: 'dish1',
                ready: false,
                archived: false,
                optionals: {}
            }, (err) => done(err));
        })

        it('updates order with ready=true', (done) => {
            target.setOrderReady('order1').then(
                () => {
                    db.collection('orders').findOne({
                        _id: 'order1'
                    }, (err, doc) => {
                        try {
                            assert.ifError(err);
                            assert(doc);
                            assert.equal(doc.ready, true);

                            done();
                        } catch (e) {
                            done(e);
                        }
                    });
                }
            )
        });
        it('disappears form .listOrdersForKitchen', (done) => {
            target.setOrderReady('order1')
                .then(() => {
                    target.listOrdersForKitchen().then((orders) => {
                        try {
                            assert.deepEqual(orders, []);
                            done();
                        } catch (e) {
                            done(e);
                        }
                    })
                })
        });

        it('emits order-ready', (done) => {
            bus.once('order-ready', (orderId) => {
                try {
                    assert.equal(orderId, 'order1');

                    done();
                } catch (e) {
                    done(e);
                }
            })

            target.setOrderReady('order1');
        });
    })

    describe('.orderDish', function () {
        it('resolves id', function (done) {
            target
                .orderDish('table1', 'dish1', { withTomato: true })
                .then((orderId) => {
                    try {
                        assert(orderId);
                        assert.equal(typeof (orderId), 'string');
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
        });

        it('emits new-dish-ordered', function (done) {
            bus.once('new-dish-ordered', function (orderId) {
                try {
                    assert(orderId);

                    done();
                } catch (e) {
                    done(e);
                }
            })

            target
                .orderDish('table1', 'dish1', { withTomato: true })
        });

        it('with archived=true', function (done) {
            target
                .orderDish('table1', 'dish1', { withTomato: true })
                .then((orderId) => {
                    db.collection('orders').findOne({
                        _id: orderId
                    }, (err, order) => {
                        try {
                            assert.ifError(err);
                            assert(order);
                            assert.equal(order.archived, false)

                            done();
                        } catch (e) {
                            done(e);
                        }
                    });
                });

        });

        it('sets price=30', function (done) {
            target
                .orderDish('table1', 'dish1', { withTomato: true })
                .then((orderId) => {
                    db.collection('orders').findOne({
                        _id: orderId
                    }, (err, order) => {
                        try {
                            assert.ifError(err);
                            assert(order);
                            assert.equal(order.price, 30);

                            done();
                        } catch (e) {
                            done(e);
                        }
                    });
                });

        });

        it('sets orderDate', function (done) {
            target
                .orderDish('table1', 'dish1', { withTomato: true })
                .then((orderId) => {
                    db.collection('orders').findOne({
                        _id: orderId
                    }, (err, order) => {
                        try {
                            assert.ifError(err);
                            assert(order);
                            assert(order.date);

                            done();
                        } catch (e) {
                            done(e);
                        }
                    });
                });

        });

        it('shows up in .listOrderedDishesByTable', function (done) {
            target
                .orderDish('table1', 'dish1', { withTomato: true })
                .then((orderId) => {
                    target
                        .listOrderedDishesByTable('table1')
                        .then((orderedDishes) => {
                            try {
                                assert.equal(orderedDishes.filter((order) => order._id === orderId).length, 1);

                                done();
                            } catch (e) {
                                done(e);
                            }
                        }, (err) => done(err));
                });
        });

        it('shows up in .listOrdersForKitchen', function (done) {
            target.orderDish('table1', 'dish1', { withTomato: true })
                .then((orderId) => {
                    target
                        .listOrdersForKitchen()
                        .then((orderedDishes) => {
                            try {
                                assert.equal(orderedDishes.filter((order) => order._id === orderId).length, 1);

                                done();
                            } catch (e) {
                                done(e);
                            }
                        }, (err) => done(err));
                });
        });
    });

    describe('.getOrder', () => {
        it('requires order id', (done) => {
            target
                .getOrder()
                .then(
                () => done(new Error()),
                (err) => {
                    try {
                        assert(err);
                        assert(err instanceof Error);
                        assert.equal(err.message, 'order id is required');

                        done();
                    } catch (e) {
                        done(e);
                    }
                }
                )
        })

        it('resolves order', (done) => {
            target
                .getOrder('order1')
                .then(
                (order) => {
                    try {


                        done()
                    } catch (e) {
                        done(e);
                    }
                }
                )
        })
    })
});