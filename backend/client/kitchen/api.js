function Tables(api) {
    this.api = api;
}

Tables.prototype.getTable = function (tableId) {
    return this.api.tables.getTable(
        tableId
    );
};

function Menu(api) {
    this.api = api;
}

Menu.prototype.getDishOptions = function (dishId) {
    return this.api.menu.listDishOptions(
        dishId
    );
};

Menu.prototype.getDish = function (dishId) {
    return this.api.menu.getDish(
        dishId
    );
};

function Orders(api) {
    this.api = api;
}

Orders.prototype.getOrder = function (orderId) {
    return this.api.orders.getOrder(
        orderId
    );
};

Orders.prototype.forKitchen = function () {
    return this.api.orders.listOrdersForKitchen();
};

Orders.prototype.setOrderReady = function (orderId) {
    return this.api.orders.setOrderReady(
        orderId
    );
};

function Settings() {
}

Settings.prototype.getIpAddresses = function () {
    return new Promise(
        (resolve, reject) => {
            var addresses = [];
            var os = require('os');
            var ifaces = os.networkInterfaces();

            Object.keys(ifaces).forEach(function (ifname) {
                var alias = 0;

                ifaces[ifname].forEach(function (iface) {
                    if ('IPv4' !== iface.family || iface.internal !== false) {
                        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                        return;
                    }

                    if (alias >= 1) {
                        addresses.push({
                            address: iface.address,
                            name: ifname + ':' + alias
                        });
                    } else {
                        addresses.push({
                            address: iface.address,
                            name: ifname
                        });
                    }
                    ++alias;
                });
            });

            resolve(addresses);
        }
    )
}

function KitchenAPI(api) {
    this.tables = new Tables(api);
    this.orders = new Orders(api);
    this.menu = new Menu(api);
    this.settings = new Settings();
}

module.exports = KitchenAPI;