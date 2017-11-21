const Db = require('tingodb')({ memStore: true }).Db;
const Settings = require('../../api/settings');
const assert = require('assert');
const EventEmitter = require('events').EventEmitter;

describe('Settings', () => {
    beforeEach((done) => {
        db = new Db('test', {});

        bus = new EventEmitter();
        bus.setMaxListeners(0);

        target = new Settings(db, bus);

        require('async').series(
            [
                (callback) => {
                    db
                        .collection('settings')
                        .insert(
                        {
                            _id: 'key2',
                            value: 'value2'
                        },
                        callback
                        );
                }
            ],
            (err) => done(err)
        );
    });

    describe('.get', () => {
        it('should required key', (done) => {
            target
                .get()
                .then(
                () => done(new Error()),
                (err) => {
                    try {
                        assert(err);
                        assert(err instanceof Error);
                        assert.equal(err.message, 'key is required');

                        done();
                    } catch (e) {
                        done(e);
                    }
                }
                );
        });

        it('should resolve value if exists', (done) => {
            target
                .get(
                'key2'
                )
                .then(
                (value) => {
                    try {
                        assert.equal(value, 'value2');

                        done();
                    } catch (e) {
                        done(e);
                    }
                }
                );
        });

        it('should resolve null if doesn\'t exists', (done) => {
            target
                .get(
                'doesnotexist'
                )
                .then(
                (value) => {
                    try {
                        assert.equal(value, null);

                        done();
                    } catch (e) {
                        done(e);
                    }
                }
                );
        });
    });

    describe('.set', () => {
        it('should require key', (done) => {
            target
                .set()
                .then(
                () => done(new Error()),
                (err) => {
                    try {
                        assert(err);
                        assert(err instanceof Error);
                        assert.equal(err.message, 'key is required');

                        done();
                    } catch (e) {
                        done(e);
                    }
                }
                );
        });

        it('should save value if provided', (done) => {
            target
                .set(
                'newkey',
                'newvalue'
                )
                .then(
                () => {
                    db
                        .collection('settings')
                        .findOne(
                        {
                            _id: 'newkey'
                        },
                        (err, doc) => {
                            try {
                                assert.ifError(err);
                                assert.deepEqual(
                                    doc,
                                    {
                                        _id: 'newkey',
                                        value: 'newvalue'
                                    }
                                );

                                done();
                            } catch (e) {
                                done(e);
                            }
                        }
                        )
                }
                )
        });

        it('should update value if provided', (done) => {
            target
                .set(
                'key2',
                'newvalue'
                )
                .then(
                () => {
                    db
                        .collection('settings')
                        .findOne(
                        {
                            _id: 'key2'
                        },
                        (err, doc) => {
                            try {
                                assert.ifError(err);
                                assert.deepEqual(
                                    doc,
                                    {
                                        _id: 'key2',
                                        value: 'newvalue'
                                    }
                                );

                                done();
                            } catch (e) {
                                done(e);
                            }
                        }
                        )
                }
                )
        });

        it('should delete entry if value is null', (done) => {
            target
                .set(
                'key2',
                null
                )
                .then(
                () => {
                    db
                        .collection('settings')
                        .findOne(
                        {
                            _id: 'key2'
                        },
                        (err, doc) => {
                            try {
                                assert.ifError(err);
                                assert.equal(
                                    doc,
                                    null
                                );

                                done();
                            } catch (e) {
                                done(e);
                            }
                        }
                        )
                }
                )
        });
    });
});