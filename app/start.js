#!/usr/bin/env node

require('async')
    .autoInject({
        config: function (callback) {
            callback(null, require('config'));
        },
        port: function (config, callback) {
            callback(null, process.env.PORT || config.port);
        },
        db: function (config, callback) {
            if (config.dbEngine === 'mongodb') {
            require('mongodb').MongoClient.connect(config.db, callback);
            } else if (config.dbEngine ==='tingodb') {
                var TingoDB = require('tingodb')();

                var db = new TingoDB.Db(require('path').resolve(config.db), {});

                callback(null, db);
            }
        },
        api: function (db, bus, callback) {
            const API = require('../api');

            callback(null, new API(db, bus));
        },
        bus: function (callback) {
            const EventEmitter = require('events').EventEmitter;

            var bus = new EventEmitter();

            bus.setMaxListeners(0);

            callback(null, bus);
        },
        web: function (api, bus, callback) {
            const Web = require('../web');

            var app = new Web(api, bus);

            callback(null, app);
        },
        io: function (server, bus, callback) {
            var io = require('socket.io')(server);

            bus.on('new-dish-ordered', (orderId) => io.emit('new-dish-ordered', orderId));
            bus.on('order-ready', (orderId) => io.emit('order-ready', orderId));

            callback(null, io);
        },
        server: function (web, callback) {
            var server = require('http').createServer(web);

            callback(null, server);
        },
        listen: function (server, port, callback) {
            try {
                server.listen(port);

                callback();
            } catch (e) {
                callback(e);
            }
        }
    }, (err) => {
        if (err) {
            console.error(err);
            process.exit(-1);

            return;
        }

        console.log('ready');
    })