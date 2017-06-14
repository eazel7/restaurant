const Db = require('tingodb')({ memStore: true }).Db;
const Tables = require('../../api/tables');
const assert = require('assert');
const EventEmitter = require('events').EventEmitter;

describe('Tables', function () {
    var db;
    var bus;
    var target;

    beforeEach(function (done) {
        db = new Db('test', {});
        bus = new EventEmitter();
        bus.setMaxListeners(0);

        target = new Tables(db, bus);

        db.collection('tables').insert({
            _id: 'table1',
            name: 'Table 1',
            status: 'free'
        }, (err) => done(err))
    });

    describe('.setTableStatus', () => {
        it('requires table id', (done) => {
            target
            .setTableStatus()
            .then(
                () => done(new Error()),
                (err) => {
                    try {
                        assert(err);
                        assert(err instanceof Error);
                        assert.equal(err.message, 'table id is required');

                        done();
                    } catch (e) {
                        done(e);
                    }
                }
            )
        })
        
        it('requires table id', (done) => {
            target
            .setTableStatus('table1')
            .then(
                () => done(new Error()),
                (err) => {
                    try {
                        assert(err);
                        assert(err instanceof Error);
                        assert.equal(err.message, 'status is required');

                        done();
                    } catch (e) {
                        done(e);
                    }
                }
            )
        });

        it('updates status in db', (done) => {
            target
            .setTableStatus('table1', 'occupied')
            .then(
                () => {
                    db.collection('tables').findOne({
                        _id: 'table1'
                    }, (err, doc) => {
                        try {
                            assert.ifError(err);
                            assert(doc);
                            assert.equal(doc.status, 'occupied');

                            done();
                        } catch (e) {
                            done(e);
                        }
                    });
                }
            );
        });

        it('emits table-status-changed', (done) => {
            bus.on('table-status-changed', (tableId) => {
                try {
                    assert.equal(tableId, 'table1');

                    done();
                } catch (e) {
                    done(e);
                }
            });

            target
            .setTableStatus('table1', 'occupied');
        });
    });

    describe('.add', function () {
        it('requires name', function (done) {
            target
                .add()
                .then(
                () => done(new Error()),
                (err) => {
                    try {
                        assert(err instanceof Error);
                        assert.equal(err.message, 'name is required');

                        done();
                    } catch (e) {
                        done(e);
                    }
                })
        })

        it('saves to db', function (done) {
            target
                .add('Table X')
                .then(
                (id) => {
                    db.collection('tables').findOne({
                        _id: id
                    }, (err, doc) => {
                        if (err) return done(err);

                        try {
                            assert.deepEqual(doc, {
                                _id: id,
                                name: 'Table X',
                                status: 'free'
                            })

                            done();
                        } catch (e) {
                            done(e);
                        }
                    })
                })
        })
    });

    describe('.delete', function () {
        it('requires table id', function (done) {
            target
                .delete()
                .then(
                () => done(new Error()),
                (err) => {
                    try {
                        assert(err instanceof Error);
                        assert.equal(err.message, 'table id is required');

                        done();
                    } catch (e) {
                        done(e);
                    }
                })
        })

        it('saves to db', function (done) {
            target
                .delete('table1')
                .then(
                () => {
                    db.collection('tables').findOne({
                        _id: 'table1'
                    }, (err, doc) => {
                        if (err) return done(err);

                        try {
                            assert(!doc);

                            done();
                        } catch (e) {
                            done(e);
                        }
                    })
                })
        })
    });

    describe('.list', function () {
        it('resolves tables', function (done) {
            target.list().then(function (tables) {
                try {
                    assert.deepEqual([{
                        _id: 'table1',
                        name: 'Table 1',
                        status: 'free'
                    }], tables)

                    done();
                } catch (e) {
                    done(e);
                }
            })
        });
    });

    describe('.getTable', function () {
        it('requires table id', function (done) {
            target.getTable().then(
                () =>  done(new Error()),
                (err) => {
                    try {
                        assert(err);
                        assert(err instanceof Error);
                        assert.equal(err.message, 'table id is required');

                        done();
                    } catch (e) {
                        done(e);
                    }
                }
            )
        });

        it('resolves table', function (done) {
            target.getTable('table1').then(function (table) {
                try {
                    assert.deepEqual(table, {
                        _id: 'table1',
                        name: 'Table 1',
                        status: 'free'
                    })

                    done();
                } catch (e) {
                    done(e);
                }
            })
        });
    });

    describe('.setAdminMessage', () => {
        it('requires table id');
        it('saves message to db');
        it('clears message if empty');
    });
});