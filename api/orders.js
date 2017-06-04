function Orders(db, bus) {
    this.dishes = db.collection('dishes');
    this.tables = db.collection('tables');
    this.orders = db.collection('orders');
    this.bus = bus;
}

Orders.prototype.closeTable = function (tableId) {
    return new Promise(
        (resolve, reject) => {
            this.orders.update({
                table: tableId
            }, {
                    $set: {
                        archived: true
                    }
                }, { multi: true }, (err) => {
                    if (err) return reject(err);

                    resolve();
                })
        }
    )
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
                            ready: true
                        }
                    }, (err) => {
                        if (err) return reject(err);

                        resolve();

                        this.bus.emit('order-ready', orderId);
                    })
            })
        }
    )
}

Orders.prototype.orderDish = function (tableId, dishId, optionals) {
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
                date: new Date(),
                price: price,
                ready: false,
                archived: false
            }, (err, doc) => {
                if (err) return reject(err);

                resolve(id);

                this.bus.emit('new-dish-ordered', id);
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