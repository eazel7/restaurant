const foundDevices = {};

const BluetoothSerialPort = require('bluetooth-serial-port/lib/bluetooth-serial-port').BluetoothSerialPort;

function BluetoothPrinterAdapter() {
    var args = [];

    for (var i = 0; i < arguments.length; i++) args.push(arguments[i]);

    BluetoothSerialPort.apply(this, args);
}

require('util').inherits(BluetoothPrinterAdapter, BluetoothSerialPort);

var btSerial = new BluetoothPrinterAdapter();

btSerial.on('found', function (address, name) {
    foundDevices[address] = name;
});


BluetoothPrinterAdapter.prototype.write = function (buf, callback) {
    if (!callback) callback = function () { };

    return BluetoothSerialPort.prototype.write.call(this, buf, callback);
};

function Printer(db, bus) {
    this.orders = db.collection('orders');
    this.tables = db.collection('tables');
    this.dishes = db.collection('dishes');
    this.dishesOptions = db.collection('dishes-options');
    this.settings = db.collection('settings');
    this.bus = bus;
}

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

Printer.prototype.getKitchenTicket = function (tableId, orders) {
    return new Promise(
        (resolve, reject) => {
            this.tables.findOne({
                _id: tableId
            }, (err, tableDoc) => {
                if (err) return reject(err);
                this.orders.find(
                    !!orders ? {
                        _id: { $in: orders }
                    } : {
                            table: tableId,
                            printed: false,
                            archived: false,
                            cancelled: {
                                $ne: true
                            }
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
                                ticket.tableName = tableDoc ? tableDoc.name : '';

                                resolve(ticket);
                            }
                            );
                    }
                    )
            });
        }
    )
};

Printer.prototype.getPrinterAddress = function () {
    return new Promise(
        (resolve, reject) => {
            this.settings.findOne({
                _id: 'printer-device'
            }, (err, doc) => {
                if (err) return reject(err);

                if (!doc) return reject(new Error('printer not selected'));

                resolve(doc.value);
            });
        }
    );
};

Printer.prototype.getShopName = function () {
    return new Promise(
        (resolve, reject) => {
            this.settings.findOne({
                _id: 'shop-name'
            }, (err, doc) => {
                if (err) return reject(err);

                if (!doc) return resolve();

                resolve(doc.value);
            });
        }
    );
};

Printer.prototype.getTableName = function (tableId) {
    return new Promise(
        (resolve, reject) => {
            this.tables.findOne({
                _id: tableId
            }, (err, doc) => {
                if (err) return reject(err);

                if (!doc) return resolve();

                resolve(doc.name);
            });
        }
    );
};

Printer.prototype.printTicket = function (tableId) {
    var printTicket = (ticket, shopName, tableName) => {
        return new Promise(
            (resolve, reject) => {
                const escpos = require('escpos');
                const printer = new escpos.Printer(btSerial);

                var maxLineSize = 32;

                printer
                    .marginLeft(0)
                    .align('LT')
                    .font('C')
                    .size(1, 1);

                printer.println('');
                printer.println('');

                if (shopName) {
                    printer.println(shopName);
                    printer.println('-'.repeat(maxLineSize));
                }

                if (tableName) {
                    printer.println(tableName);
                }

                var date = new Date();
                var dateLine = `Fecha: ${require('dateformat')(date, 'dd/mm/yyyy HH:MM')}`;

                printer
                    .println(dateLine);

                ticket.orders.forEach((item) => {
                    printer.println('');

                    var start = item.amount.toFixed() + ' x ';
                    var end = '   $ ' + item.price.toFixed(2);
                    var middle = item.name.slice(0, maxLineSize - start.length - end.length)

                    var line = start + middle + ' '.repeat(maxLineSize - start.length - middle.length - end.length) + end;

                    printer.println(line);
                });

                printer.println('-'.repeat(maxLineSize));
                printer.align('RT');
                printer.println('$ ' + ticket.total.toFixed(2));
                printer.feed(5);

                return resolve(ticket);
            }
        );
    };

    var connect = (address) => {
        return new Promise(
            (resolve, reject) => {
                btSerial.findSerialPortChannel(address, function (channel) {
                    btSerial
                        .connect(
                        address,
                        channel,
                        function () {
                            resolve();
                        },
                        function () {
                            return reject(new Error('cannot connect to printer'));
                        });
                }, function () {
                    return reject(new Error('bluetooth device not found'))
                });
            }
        );
    };

    return Promise.all([
        this.getTicket(tableId),
        this.getPrinterAddress(),
        this.getShopName(),
        this.getTableName(tableId)
    ])
        .then((results) => {
            return new Promise(
                (resolve, reject) => {
                    var ticket = results[0];
                    var address = results[1];
                    var shopName = results[2];
                    var tableName = results[3];

                    var isOpen = btSerial.isOpen();

                    if (!isOpen) {
                        connect(address)
                            .then(() => {
                                return printTicket(ticket, shopName, tableName);
                            })
                            .then((result) => resolve(result), (err) => reject(err));
                    } else {
                        printTicket(ticket, shopName, tableName)
                            .then((result) => resolve(result), (err) => reject(err));
                    }
                }
            );
        }
        );
};

Printer.prototype.printKitchenTicket = function (tableId, orders) {
    var printTicket = (ticket) => {
        return new Promise(
            (resolve, reject) => {
                const escpos = require('escpos');
                const printer = new escpos.Printer(btSerial);

                var maxLineSize = 32;

                printer
                    .marginLeft(0)
                    .align('LT')
                    .font('C')
                    .size(1, 1);

                var date = new Date();
                var dateLine = `Fecha: ${require('dateformat')(date, 'dd/mm/yyyy HH:MM')}`;

                printer
                    .println(dateLine);

                if (ticket.tableName) printer.println(ticket.tableName);
                printer
                    .println('');
                printer
                    .println('');

                ticket.orders.forEach((item) => {
                    var line = item.amount.toFixed(0) + ' x ' + item.name;
                    line = line.slice(0, maxLineSize);

                    printer.println(line);

                    item.optionals.forEach((optional) => {
                        printer.println(optional.name + ': ');
                        printer.println(optional.value);
                    });

                    if (item.notes) {
                        printer.println('Notas:');
                        printer.println(item.notes);
                    }

                    printer.println('-'.repeat(maxLineSize));

                    printer.println('   ');
                });

                printer.feed(5);

                return resolve(ticket);
            });
    };

    var connect = (address) => {
        return new Promise(
            (resolve, reject) => {
                btSerial.findSerialPortChannel(address, function (channel) {
                    btSerial
                        .connect(
                        address,
                        channel,
                        function () {
                            resolve();
                        },
                        function () {
                            return reject(new Error('cannot connect to printer'));
                        });
                }, function () {
                    return reject(new Error('bluetooth device not found'))
                });
            }
        );
    };

    return Promise.all([
        this.getKitchenTicket(tableId, orders),
        this.getPrinterAddress()
    ])
        .then((results) => {
            return new Promise(
                (resolve, reject) => {
                    var ticket = results[0];
                    var address = results[1];

                    var isOpen = btSerial.isOpen();

                    if (!isOpen) {
                        connect(address)
                            .then(() => {
                                return printTicket(ticket).then(() => {
                                    this.orders.update(tableId ? {
                                        table: tableId
                                    } : {
                                            _id: {
                                                $in: orders
                                            }
                                        }, {
                                            $set: {
                                                printed: true
                                            }
                                        }, {
                                            multi: true
                                        }, (err) => {
                                            if (err) return reject(err);

                                            require('async').eachSeries(ticket.orders,
                                                (order, callback) => {
                                                    this.bus.emit('new-dish-ordered', order._id);

                                                    callback();
                                                },
                                                (err) => {
                                                    if (err) reject(err);

                                                    resolve();
                                                });
                                        })
                                });
                            })
                            .then((result) => resolve(result), (err) => reject(err));
                    } else {
                        printTicket(ticket)
                            .then((result) => {
                                this.orders.update(tableId ? {
                                    table: tableId
                                } : {
                                        _id: {
                                            $in: orders
                                        }
                                    }, {
                                        $set: {
                                            printed: true
                                        }
                                    }, {
                                        multi: true
                                    }, (err) => {
                                        if (err) return reject(err);

                                        require('async').eachSeries(ticket.orders,
                                            (order, callback) => {
                                                this.bus.emit('new-dish-ordered', order._id);

                                                callback();
                                            },
                                            (err) => {
                                                if (err) reject(err);

                                                resolve(result);
                                            });
                                    })
                            }, (err) => reject(err));
                    }
                }
            );
        }
        );
};

Printer.prototype.startScan = function () {
    btSerial.inquire();

    return Promise.resolve();
};

Printer.prototype.listDevices = function () {
    var printers = [];

    for (var address in foundDevices) printers.push({
        name: foundDevices[address],
        address: address
    });

    return Promise.resolve(printers);
};

module.exports = Printer;
