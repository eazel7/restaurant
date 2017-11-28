function Printer(db, bus) {
}

Printer.prototype.printTicket = function (tableId) {
    return Promise.reject(new Error('unable to print: stub module'));
};

Printer.prototype.printKitchenTicket = function (tableId) {
    return Promise.reject(new Error('unable to print: stub module'));
};

Printer.prototype.startScan = function () {
    return Promise.resolve();
};

Printer.prototype.listDevices = function () {
    return Promise.resolve([]);
};

module.exports = Printer;
