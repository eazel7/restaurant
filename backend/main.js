require('async')
  .autoInject({
    config: function (callback) {
      callback(null, require('config'));
    },
    port: function (config, callback) {
      callback(null, process.env.PORT || config.port);
    },
    db: function (config, callback) {
      if (config.mongodb) {
        require('mongodb').MongoClient.connect(config.db, callback);
      } else {
        var TingoDB = require('tingodb')();

        var db = new TingoDB.Db(require('path').resolve(config.db), {});

        callback(null, db);
      }
    },
    pair: function (config, callback) {
      callback(null, config.rsa);
    },
    api: function (db, bus, pair, callback) {
      const API = require('./api');

      callback(null, new API(db, bus, pair));
    },
    bus: function (callback) {
      const EventEmitter = require('events').EventEmitter;

      var bus = new EventEmitter();

      bus.setMaxListeners(0);

      callback(null, bus);
    },
    web: function (api, bus, callback) {
      const Web = require('./web');

      Web(api, bus)
        .then((app) => callback(null, app), (err) => callback(err || new Error()));
    },
    io: function (server, bus, callback) {
      var io = require('socket.io')(server);

      bus.on('new-dish-ordered', (orderId) => io.emit('new-dish-ordered', orderId));
      bus.on('order-ready', (orderId) => io.emit('order-ready', orderId));
      bus.on('table-status-changed', (tableId) => io.emit('table-status-changed', tableId));

      callback(null, io);
    },
    server: function (web, callback) {
      var server = require('http').createServer(web);

      callback(null, server);
    },
    listen: function (server, port, callback) {
      server.listen(port, callback);
    },
    postApp: function (web, config, callback) {
      if (!config.postAppSpawn) return callback();

      var child = require('child_process').spawn(
        config.postAppSpawn.command,
        config.postAppSpawn.args
      );

      child.stdout.pipe(process.stdout);
      child.stderr.pipe(process.stderr);      

      callback();
    }
  }, (err, results) => {
    if (err) {
      console.error(err);
      process.exit(-1);

      return;
    }
  });