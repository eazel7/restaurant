const Db = require('tingodb')({ memStore: true }).Db;
const Users = require('../../api/users');
const assert = require('assert');
const EventEmitter = require('events').EventEmitter;

describe('Users', function () {
    var db;
    var bus;
    var target;

    beforeEach(function (done) {
        db = new Db('test', {});
        bus = new EventEmitter();
        bus.setMaxListeners(0);

        target = new Users(db, bus);

        done();
    });

    describe('.create', () => {
        it('requires name', (done) => {
            target
                .create().then(
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
                })
        });

        it('requires roles', (done) => {
            target
                .create('user1').then(
                () => done(new Error()),
                (err) => {
                    try {
                        assert(err);
                        assert(err instanceof Error);
                        assert.equal(err.message, 'roles are required');

                        done();
                    } catch (e) {
                        done(e);
                    }
                })
        });

        it('requires pin', (done) => {
            target
                .create('user1', ['waiter']).then(
                () => done(new Error()),
                (err) => {
                    try {
                        assert(err);
                        assert(err instanceof Error);
                        assert.equal(err.message, 'pin is required');

                        done();
                    } catch (e) {
                        done(e);
                    }
                })
        });

        it('saves user', (done) => {
            target
                .create('user 1', ['waiter'], '1234')
                .then((userId) => {
                    db.collection('users').findOne({ _id: userId }, (err, doc) => {
                        try {
                            assert.ifError(err);
                            assert(doc);
                            assert.equal(doc.name, 'user 1');
                            assert.deepEqual(doc.roles, ['waiter']);
                            assert.equal(doc.pin, '1234');

                            done();
                        } catch (e) {
                            done(e);
                        }
                    });
                })
        });
    });

    describe('.listUsers', () => {
        beforeEach((done) => {
            db.collection('users').insert({
                _id: 'user1',
                name: 'User 1',
                roles: ['admin'],
                pin: '1234'
            }, (err) => done(err))
        })

        it('returns a list', (done) => {
            target.listUsers().then((users) => {
                try {
                    assert(users);
                    assert(users instanceof Array);
                    assert.deepEqual(users, [{ _id: 'user1', name: 'User 1' }]);

                    done();
                } catch (e) {
                    done(e);
                }
            })
        })
    })

    describe('.checkPin', () => {
        beforeEach((done) => {
            db.collection('users').insert({
                _id: 'user1',
                name: 'User 1',
                roles: ['admin'],
                pin: '1234'
            }, (err) => done(err))
        })

        it('requires user id', (done) => {
            target.checkPin().then(() => done(new Error()),
                (err) => {
                    try {
                        assert(err);
                        assert(err instanceof Error);
                        assert.equal(err.message, 'user id is required');

                        done();
                    } catch (e) {
                        done(e);
                    }
                });
        });

        it('requires pin', (done) => {
            target.checkPin('user1').then(() => done(new Error()),
                (err) => {
                    try {
                        assert(err);
                        assert(err instanceof Error);
                        assert.equal(err.message, 'pin is required');

                        done();
                    } catch (e) {
                        done(e);
                    }
                });
        });

        it('rejects invalid pin', (done) => {
            target.checkPin('user1', '4302').then(() => done(new Error()),
                (err) => {
                    try {
                        assert(err);
                        assert(err instanceof Error);
                        assert.equal(err.message, 'invalid pin');

                        done();
                    } catch (e) {
                        done(e);
                    }
                });
        });

        it('resolves valid pin', (done) => {
            target.checkPin('user1', '1234').then(() => done());
        });
    });

    describe('.get', () => {
        beforeEach((done) => {
            db.collection('users').insert({
                _id: 'user1',
                name: 'User 1',
                roles: ['admin', 'waiter'],
                pin: '1234'
            }, (err) => done(err));
        })

        it('requires user id', (done) => {
            target.get().then(
                () => done(new Error()),
                (err) => {
                    try {
                        assert(err);
                        assert(err instanceof Error);
                        assert.equal(err.message, 'user id is required');

                        done();
                    } catch (e) {
                        done(e);
                    }
                }
            );
        });

        it('resolves user', (done) => {
            target.get('user1').then(
                (user) => {
                    try {
                        assert.deepEqual(
                            user,
                            {
                                _id: 'user1',
                                name: 'User 1',
                                roles: ['admin', 'waiter'],
                                pin: '1234'
                            }
                        );

                        done();
                    } catch (e) {
                        done(e);
                    }
                }
            );
        });
    });
});