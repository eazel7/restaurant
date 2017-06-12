
function Menu(api) {
    this.api = api;
}

Menu.prototype.listDishOptions = function (dishId) {
    return this.api.listDishOptions(
        dishId
    );
};
Menu.prototype.getDishOption = function (optionId) {
    return this.api.getDishOption(
        optionId
    );
};

Menu.prototype.getDishOptions = function (dishId) {
    return this.api.listDishOptions(
        dishId
    );
};

Menu.prototype.getDish = function (dishId) {
    return this.api.getDish(
        dishId
    );
};

Menu.prototype.listCategories = function () {
    return this.api.listCategories();
};

Menu.prototype.listDishesByCategory = function (categoryId) {
    return this.api.listDishesByCategory(
        categoryId
    );
};

function Orders(api) {
    this.api = api;
}

Orders.prototype.closeTable = function (tableId) {
    return this.api.closeTable(
        tableId
    );
};

Orders.prototype.getOrder = function (orderId) {
    return this.api.getOrder(
        orderId
    );
};

Orders.prototype.placeOrder = function (tableId, dishId, optionals) {
    return this.api.orderDish(
        tableId,
        dishId,
        optionals
    );
};

Orders.prototype.listByTable = function (tableId) {
    return this.api.listOrderedDishByTable(
        tableId
    );
};

function WaiterAPI(api) {
    this.menu = new Menu(api);
    this.orders = new Orders(api);
}

module.exports = WaiterAPI;