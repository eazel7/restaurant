function Printer(db, bus) {
    this.bus = bus;

    this.orders = db.collection('orders');
    this.dishes = db.collection('dishes');
    this.tables = db.collection('tables');
    this.dishesOptions = db.collection('dishes-options');
}

Printer.prototype.printTicket = function (tableId) {
    return new Promise.resolve();
};

Printer.prototype.printKitchenTicket = function (tableId) {
    return new Promise(
        (resolve, reject) => {
            this.orders.find({
                table: tableId,
                printed: false,
                archived: false
            }).toArray(
                (err, docs) => {
                    if (err) return reject(err);

                    if (!docs.length) return resolve();

                    this.orders.update({
                        table: tableId
                    }, {
                            $set: {
                                printed: true
                            }
                        }, {
                            multi: true
                        }, (err) => {
                            if (err) return reject(err);

                            this.tables.update({
                                _id: tableId
                            }, {
                                    $set: {
                                        status: 'occupied'
                                    }
                                }, (err) => {
                                    if (err) return reject(err);

                                    resolve();

                                    this.bus.emit('table-status-changed', tableId);

                                    require('async')
                                        .eachSeries(
                                        docs,
                                        (doc, callback) => {
                                            try {
                                                this.bus.emit('new-dish-ordered', doc._id);
                                                callback();
                                            } catch (e) {
                                            } finally {
                                                callback();
                                            }
                                        },
                                        (err) => { }
                                        )
                                });
                        });
                }
                )
        }
    )
};

Printer.prototype.getTicket = function (tableId) {
    return new Promise(
        (resolve, reject) => {
            this.orders.find(
                {
                    table: tableId,
                    archived: false
                }
            )
                .toArray(
                (err, docs) => {
                    if (err) return reject(err);

                    var ticket = {
                        orders: [],
                        total: 0
                    };

                    require('async')
                        .mapSeries(
                        docs,
                        (orderedDish, callback) => {
                            this
                                .dishes
                                .findOne(
                                {
                                    _id: orderedDish.dish
                                },
                                (err, dishDoc) => {
                                    if (err) return callback(err);

                                    ticket.total += orderedDish.price;

                                    callback(
                                        null,
                                        {
                                            name: dishDoc.name,
                                            amount: orderedDish.amount,
                                            price: orderedDish.price
                                        }
                                    );
                                }
                                );
                        },
                        (err, orderedDishes) => {
                            if (err) return reject(err);

                            ticket.orders = orderedDishes;

                            resolve(ticket);
                        }
                        );
                }
                )
        }
    )
};

Printer.prototype.getKitchenTicket = function (tableId) {
    return new Promise(
        (resolve, reject) => {
            this.tables.findOne({
                _id: tableId
            }, (err, tableDoc) => {
                if (err) return reject(err);

                this.orders.find(
                    {
                        table: tableId,
                        printed: false,
                        archived: false
                    }
                )
                    .toArray(
                    (err, docs) => {
                        if (err) return reject(err);

                        var ticket = {
                            orders: []
                        };

                        require('async')
                            .mapSeries(
                            docs,
                            (orderedDish, callback) => {
                                this
                                    .dishes
                                    .findOne(
                                    {
                                        _id: orderedDish.dish
                                    },
                                    (err, dishDoc) => {
                                        if (err) return callback(err);

                                        require('async')
                                            .mapSeries(
                                            Object.keys(orderedDish.optionals),
                                            (optionalId, callback) => {
                                                this.dishesOptions.findOne({
                                                    _id: optionalId
                                                },
                                                    (err, doc) => {
                                                        if (err) return callback(err);
                                                        if (!doc) return callback(new Error('optional not found: ' + optionalId));

                                                        callback(null, {
                                                            name: doc.name,
                                                            value: orderedDish.optionals[optionalId]
                                                        })
                                                    })
                                            },
                                            (err, optionals) => {


                                                callback(
                                                    null,
                                                    {
                                                        name: dishDoc.name,
                                                        amount: orderedDish.amount,
                                                        notes: orderedDish.notes,
                                                        optionals: optionals
                                                    }
                                                );
                                            }
                                            )
                                    }
                                    );
                            },
                            (err, orderedDishes) => {
                                if (err) return reject(err);

                                ticket.orders = orderedDishes;
                                ticket.tableName = tableDoc.name;

                                resolve(ticket);
                            }
                            );
                    }
                    )
            });
        }
    )
};

Printer.prototype.startScan = function () {
    return Promise.resolve();
};

Printer.prototype.listDevices = function () {
    return Promise.resolve([]);
};

module.exports = Printer;
