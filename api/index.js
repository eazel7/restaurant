const Menu = require('./menu');
const Orders = require('./orders');
const Tables = require('./tables');
const Users = require('./users');
const Settings = require('./settings');
const Customers = require('./customers');
const Stats = require('./stats');
const Printer = require('./printer');

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
    this.customers = new Customers(db, bus);
    this.stats = new Stats(db, bus);
    this.printer = new Printer(db, bus);
}

module.exports = API;