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

Tables.prototype.setAdminMessage = function (tableId, message) {
    return this.api.tables.setAdminMessage(
        tableId,
        message
    );
};

function Users(api) {
    this.api = api;
}

Users.prototype.list = function () {
    return this.api.users.listUsers();
}

Users.prototype.create = function (name, roles, pin) {
    return this.api.users.create(
        name,
        roles,
        pin
    )
}

function Menu(api) {
    this.api = api;
}

Menu.prototype.addDishOption = function (dishId, name, kind) {
    return this.api.menu.addDishOption(
        dishId,
        kind,
        name
    );
};

Menu.prototype.addDishOptionItem = function (optionId, name) {
    return this.api.menu.addDishOptionItem(
        optionId,
        name
    );
};

Menu.prototype.deleteDishOptionItem = function (optionId, item) {
    return this.api.menu.deleteDishOptionItem(
        optionId,
        item
    );
};

Menu.prototype.deleteDishOption = function (optionId) {
    return this.api.menu.deleteDishOption(
        optionId
    );
};

Menu.prototype.createCategory = function (name) {
    return this.api.menu.createCategory(
        name
    );
};

Menu.prototype.createDish = function (name) {
    return this.api.menu.createDish(
        name
    );
};

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

Menu.prototype.getDish = function (dishId) {
    return this.api.menu.getDish(
        dishId
    );
};

Menu.prototype.getCategory = function (categoryId) {
    return this.api.menu.getCategory(
        categoryId
    );
};

Menu.prototype.deleteCategory = function (categoryId) {
    return this.api.menu.deleteCategory(
        categoryId
    );
};

Menu.prototype.listCategories = function () {
    return this.api.menu.listCategories();
};

Menu.prototype.listDishes = function () {
    return this.api.menu.listDishes();
};

Menu.prototype.listDishesByCategory = function (category) {
    return this.api.menu.listDishesByCategory(
        category
    );
};

Menu.prototype.renameDish = function (dishId, name) {
    return this.api.menu.renameDish(
        dishId,
        name
    );
};

Menu.prototype.setDishPrice = function (dishId, price) {
    return this.api.menu.setDishPrice(
        dishId,
        price
    );
};

Menu.prototype.removeDishFromCategory = function (dishId, categoryId) {
    return this.api.menu.removeDishFromCategory(
        dishId,
        categoryId
    );
};

Menu.prototype.addDishToCategory = function (dishId, categoryId) {
    return this.api.menu.addDishToCategory(
        dishId,
        categoryId
    );
};

function Settings(api) {
    this.api = api;
}

Settings.prototype.get = function (key) {
    return this.api.get(
        key
    );
};

Settings.prototype.set = function (key, value) {
    return this.api.set(
        key,
        value
    );
};

function AdminAPI(api) {
    this.orders = new Orders(api);
    this.tables = new Tables(api);
    this.users = new Users(api);
    this.menu = new Menu(api);
    this.settings = new Settings(api);  
}

module.exports = AdminAPI;