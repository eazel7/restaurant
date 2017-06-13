const Db = require('tingodb')({ memStore: true }).Db;
const Tables = require('../../api/tables');
const assert = require('assert');

describe('Tables', function () {
    var db;
    var target;

    beforeEach(function (done) {
        db = new Db('test', {});

        target = new Tables(db);

        db.collection('tables').insert({
            _id: 'table1',
            name: 'Table 1'
        }, (err) => done(err))
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
                        name: 'Table 1'
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
                        name: 'Table 1'
                    })

                    done();
                } catch (e) {
                    done(e);
                }
            })
        });
    });
})