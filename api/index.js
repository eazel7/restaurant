const Menu = require('./menu');
const Orders = require('./orders');
const Tables = require('./tables');
const Users = require('./users');
const Settings = require('./settings');

function API(db, bus, pair) {
    if (!bus) {
        const EventEmitter = require('events').EventEmitter;

        bus = new EventEmitter();

        bus.setMaxListeners(0);
    }

    this.menu = new Menu(db, bus);
    this.orders = new Orders(db, bus);
    this.tables = new Tables(db, bus);
    this.users = new Users(db, bus, pair)
    this.settings = new Settings(db, bus);
}

module.exports = API;