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
    api: function (db, bus, callback) {
      const API = require('./api');

      callback(null, new API(db, bus));
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

      callback(null, io);
    },
    server: function (web, callback) {
      var server = require('http').createServer(web);

      callback(null, server);
    },
    listen: function (server, port, callback) {
      server.listen(port, callback);
    }
  }, (err, results) => {
    if (err) {
      console.error(err);
      process.exit(-1);

      return;
    }

    console.log(results.config);
    
    if (!results.config.browser) return;
    else require('./start-electron')(results);
  });