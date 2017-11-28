function Orders(db, bus) {
    this.dishes = db.collection('dishes');
    this.tables = db.collection('tables');
    this.orders = db.collection('orders');
    this.settings = db.collection('settings');

    this.bus = bus;
}

Orders.prototype.closeTable = function (tableId) {
    return new Promise(
        (resolve, reject) => {
            this.tables.findOne({
                _id: tableId
            }, (err, tableDoc) => {
                if (err) return reject(err);

                if (!tableDoc) return reject('Invalid table');

                this.orders.update({
                    table: tableId,
                    archived: false
                }, {
                        $set: {
                            archived: true,
                            customer: tableDoc.customer
                        }
                    }, { multi: true }, (err) => {
                        if (err) return reject(err);

                        this.tables.update({
                            _id: tableId
                        }, {
                                $set: {
                                    status: 'free',
                                    customer: null
                                }
                            }, (err) => {
                                if (err) return reject(err);

                                resolve();

                                this.bus.emit('table-status-changed', tableId);
                            });
                    });
            });
        }
    );
};

Orders.prototype.cancelOrder = function (orderId) {
    if (!orderId) return Promise.reject(new Error('order id is required'));

    return Promise.reject(new Error('not implemented'));
};

Orders.prototype.setOrderReady = function (orderId) {
    if (!orderId) return Promise.reject(new Error('order id is required'));

    return new Promise(
        (resolve, reject) => {
            this.orders.findOne({
                _id: orderId
            }, (err, doc) => {
                if (err) return reject(err);
                if (!doc) return reject(new Error('invalid order id'));

                this.orders.update({
                    _id: orderId
                }, {
                        $set: {
                            ready: true,
                            readyAt: Date.now()
                        }
                    }, (err) => {
                        if (err) return reject(err);

                        resolve();

                        //TODO: Print ticket
                        this.bus.emit('order-ready', orderId);
                    })
            })
        }
    )
}

Orders.prototype.orderDish = function (tableId, dishId, optionals, notes, amount) {
    return new Promise((resolve, reject) => {
        this.dishes.findOne({
            _id: dishId
        }, (err, dish) => {
            if (err) return reject(err);

            var id = require('shortid').generate();
            var price = dish.price;

            this.orders.insert({
                _id: id,
                table: tableId,
                dish: dishId,
                optionals: optionals,
                date: Date.now(),
                price: price * amount,
                ready: false,
                archived: false,
                printed: false,
                notes: notes || '',
                amount: amount
            }, (err, doc) => {
                if (err) return reject(err);

                this.tables.update({
                    _id: tableId
                }, {
                        $set: {
                            status: 'occupied'
                        }
                    }, (err) => {
                        if (err) return reject(err);

                        resolve(id);

                        this.bus.emit('new-dish-ordered', id);
                        this.bus.emit('table-status-changed', tableId);
                    });
            })
        });
    });
};

Orders.prototype.listOrderedDishesByTable = function (table) {
    return new Promise((resolve, reject) => {
        this.orders.find({
            table: table,
            archived: false
        }).toArray((err, docs) => {
            if (err) return reject(err);

            resolve(docs);
        })
    })
}

Orders.prototype.listOrdersForKitchen = function () {
    return new Promise((resolve, reject) => {
        this.orders.find({
            ready: false,
            archived: false
        }).toArray((err, docs) => {
            if (err) return reject(err);

            resolve(docs);
        })
    })
}

Orders.prototype.getOrder = function (orderId) {
    if (!orderId) return Promise.reject(new Error('order id is required'));

    return new Promise(
        (resolve, reject) => {
            this.orders.findOne({
                _id: orderId
            },
                (err, order) => {
                    if (err) return reject(err);

                    resolve(order);
                })
        }
    )
}

module.exports = Orders;