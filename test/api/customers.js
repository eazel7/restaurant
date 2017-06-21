const Db = require('tingodb')({ memStore: true }).Db;
const assert = require('assert');
const EventEmitter = require('events').EventEmitter;
const Customers = require('../../api/customers');
const async = require('async');

describe('Customers', () => {
    var db;
    var bus;
    var target;

    beforeEach(() => {
        bus = new EventEmitter();
        bus.setMaxListeners(0);

        db = new Db('test', {});

        target = new Customers(db, bus);
    });

    describe('.search', () => {
        beforeEach((done) => {
            require('async')
                .series(
                [
                    (callback) => db
                        .collection('customers')
                        .insert(
                        {
                            _id: 'customer1',
                            name: 'John Doe'
                        }, (err) => callback(err)),
                    (callback) => db
                        .collection('customers')
                        .insert(
                        {
                            _id: 'customer2',
                            name: 'Mary Doe'
                        }, (err) => callback(err))
                ],
                (err) => done(err)
                );
        });

        it('requires filter', (done) => {
            target
                .search()
                .then(
                () => done(new Error()),
                (err) => {
                    try {
                        assert(err);
                        assert(err instanceof Error);
                        assert.equal(err.message, 'filter is required');

                        done();
                    } catch (e) {
                        done(e);
                    }
                }
                );
        });

        it('resolves filtered result', (done) => {
            target
                .search('Mary')
                .then(
                (results) => {
                    try {
                        assert(results);
                        assert.deepEqual(results, [{
                            _id: 'customer2',
                            name: 'Mary Doe'
                        }])

                        done();
                    } catch (e) {
                        done(e);
                    }
                }
                );
        });
    });

    describe('.get', () => {
        beforeEach((done) => {
            db
                .collection('customers')
                .insert(
                {
                    _id: 'customer1',
                    name: 'John Doe'
                },
                (err) => done(err)
                );
        });

        it('requires customer id', (done) => {
            target
                .get()
                .then(
                () => done(new Error()),
                (err) => {
                    try {
                        assert(err);
                        assert(err instanceof Error);
                        assert.equal(err.message, 'customer id is required');

                        done();
                    } catch (e) {
                        done(e);
                    }
                }
                );
        });

        it('resolves customer', (done) => {
            target
                .get('customer1')
                .then(
                (customer) => {
                    try {
                        assert(customer);
                        assert.equal(customer._id, 'customer1');
                        assert.equal(customer.name, 'John Doe');

                        done();
                    } catch (e) {
                        done(e);
                    }
                }
                )
        });
    });

    describe('.create', () => {
        it('requires name', (done) => {
            target.create()
                .then(
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
                )
        });

        it('saves to db', (done) => {
            target
                .create('John Doe')
                .then(
                (customerId) => {
                    db
                        .collection('customers')
                        .findOne({
                            _id: customerId
                        }, (err, doc) => {
                            try {
                                assert.ifError(err);
                                assert(doc);
                                assert.equal(doc.name, 'John Doe');

                                done();
                            } catch (e) {
                                done(e);
                            }
                        });
                }
                );
        });
    });
});