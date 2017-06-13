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

Orders.prototype.getOrder =function (orderId) {
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

function KitchenAPI(api) {
    this.tables = new Tables(api);
    this.orders = new Orders(api);
    this.menu = new Menu(api);
}

module.exports = KitchenAPI;