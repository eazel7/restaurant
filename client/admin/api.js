function Orders(api) {
    this.api = api;
}

Orders.prototype.placeOrder = function (tableId, dishId, optionals) {
    return this.api.orderDish(
        tableId,
        dishId,
        optionals
    );
};

Orders.prototype.listByTable = function (tableId) {
    return this.api.listOrderedDishesByTable(
        tableId
    );
};

function Tables(api) {
    this.api = api;
}

Tables.prototype.list = function () {
    return this.api.tables.list();
}

Tables.prototype.delete = function (tableId) {
    return this.api.tables.delete(
        tableId
    );
};

Tables.prototype.create = function (name) {
    return this.api.tables.add(
        name
    );
};

Tables.prototype.getTable = function (tableId) {
    return this.api.tables.getTable(
        tableId
    );
};

function Users(api) {
    this.api = api;
}

Users.prototype.list = function () {
    return this.api.users.list();
}

Users.prototype.create = function (name, roles, pin) {
    return this.api.users.create(
        name,
        roles,
        pin
    )
}

function AdminAPI(api) {
    this.orders = new Orders(api);
    this.tables = new Tables(api);
    this.users = new Users(api);
}

module.exports = AdminAPI;