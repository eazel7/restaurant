function Tables(db, bus) {
    this.tables = db.collection('tables');
    this.bus = bus;
}

Tables.prototype.add = function (name) {
    if (!name) return Promise.reject(new Error('name is required'));

    return new Promise(
        (resolve, reject) => {
            var id = require('shortid').generate();

            this.tables.insert({
                _id: id,
                name: name,
                status: 'free'
            }, (err) => {
                if (err) return reject(err);

                resolve(id);
            });
        }
    )
};

Tables.prototype.list = function () {
    return new Promise((resolve, reject) => {
        this.tables.find({}).toArray((err, docs) => {
            if (err) return reject(err);

            resolve(docs);
        })
    })
};

Tables.prototype.getTable = function (tableId) {
    if (!tableId) return Promise.reject(new Error('table id is required'));

    return new Promise((resolve, reject) => {
        this.tables.findOne({ _id: tableId }, (err, doc) => {
            if (err) return reject(err);

            resolve(doc);
        })
    })
};

Tables.prototype.delete = function (tableId) {
    if (!tableId) return Promise.reject(new Error('table id is required'));

    return new Promise((resolve, reject) => {
        this.tables.remove({ _id: tableId }, (err) => {
            if (err) return reject(err);

            resolve();
        })
    })
};

Tables.prototype.setTableStatus = function (tableId, status) {
    if (!tableId) return Promise.reject(new Error('table id is required'));
    if (!status) return Promise.reject(new Error('status is required'));

    return new Promise(
        (resolve, reject) => {
            this.tables.update({
                _id: tableId
            }, {
                $set: {
                    status: status
                }
            }, (err) => {
                if (err) return reject(err);

                resolve();

                this.bus.emit('table-status-changed', tableId);
            })
        }
    )
};

Tables.prototype.setAdminMessage = function (tableId, message) {
    if (!tableId) return Promise.reject(new Error('table id is required'));

    return new Promise(
        (resolve, reject) => {
            this.tables.update({
                _id: tableId
            }, {
                $set: {
                    'adminMessage': message || null
                }
            }, (err) => {
                if (err) return reject(err);

                resolve();
            })
        }
    )
};

module.exports = Tables;