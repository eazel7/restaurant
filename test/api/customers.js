const Db = require('tingodb')({ memStore: true }).Db;
const assert = require('assert');
const EventEmitter = require('events').EventEmitter;
const Customers = require('../../api/customers');

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