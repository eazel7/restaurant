function Menu(api) {
    this.api = api;
}

Menu.prototype.listDishOptions = function (dishId) {
    return this.api.menu.listDishOptions(
        dishId
    );
};
Menu.prototype.getDishOption = function (optionId) {
    return this.api.menu.getDishOption(
        optionId
    );
};

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

Menu.prototype.listCategories = function () {
    return this.api.menu.listCategories();
};

Menu.prototype.listDishesByCategory = function (categoryId) {
    return this.api.menu.listDishesByCategory(
        categoryId
    );
};

function Orders(api) {
    this.api = api;
}

Orders.prototype.closeTable = function (tableId) {
    return this.api.orders.closeTable(
        tableId
    );
};

Orders.prototype.getOrder = function (orderId) {
    return this.api.orders.getOrder(
        orderId
    );
};

Orders.prototype.placeOrder = function (tableId, dishId, optionals) {
    return this.api.orders.orderDish(
        tableId,
        dishId,
        optionals
    );
};

Orders.prototype.listByTable = function (tableId) {
    return this.api.orders.listOrderedDishesByTable(
        tableId
    );
};

function Tables(api) {
    this.api = api;
}

Tables.prototype.list = function () {
    return this.api.tables.list();
};

Tables.prototype.getTable = function (tableId) {
    return this.api.tables.getTable(
        tableId
    );
};

function WaiterAPI(api) {
    this.menu = new Menu(api);
    this.orders = new Orders(api);
    this.tables = new Tables(api);
}

module.exports = WaiterAPI;