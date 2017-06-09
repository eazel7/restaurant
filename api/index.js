const Menu = require('./menu');
const Orders = require('./orders');
const Tables = require('./tables');
const Users = require('./users');

function API(db, bus) {
    if (!bus) {
        const EventEmitter = require('events').EventEmitter;

        bus = new EventEmitter();

        bus.setMaxListeners(0);
    }

    this.menu = new Menu(db, bus);
    this.orders = new Orders(db, bus);
    this.tables = new Tables(db, bus);
    this.users = new Users(db, bus)
}

module.exports = API;