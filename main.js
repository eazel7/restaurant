const electron = require('electron');

const { app, BrowserWindow } = electron;

require('async')
  .autoInject({
    config: function (callback) {
      callback(null, require('config'));
    },
    port: function (config, callback) {
      callback(null, process.env.PORT || config.port);
    },
    db: function (config, callback) {
      var TingoDB = require('tingodb')();

      try{
        require('fs').mkdirSync(require('path').join(__dirname, 'data'));
      } catch (e) {}
      var db = new TingoDB.Db(require('path').join(__dirname, 'data'), {});

      callback(null, db);
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

      var expressApp = new Web(api, bus);

      callback(null, expressApp);
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

    // simple parameters initialization
    const electronConfig = {
      URL_LAUNCHER_TOUCH: process.env.URL_LAUNCHER_TOUCH === '1' ? 1 : 0,
      URL_LAUNCHER_TOUCH_SIMULATE: process.env.URL_LAUNCHER_TOUCH_SIMULATE === '1' ? 1 : 0,
      URL_LAUNCHER_FRAME: process.env.URL_LAUNCHER_FRAME === '1' ? 1 : 0,
      URL_LAUNCHER_KIOSK: process.env.URL_LAUNCHER_KIOSK === '1' ? 1 : 0,
      URL_LAUNCHER_NODE: process.env.URL_LAUNCHER_NODE === '1' ? 1 : 0,
      URL_LAUNCHER_WIDTH: parseInt(process.env.URL_LAUNCHER_WIDTH || 1920, 10),
      URL_LAUNCHER_HEIGHT: parseInt(process.env.URL_LAUNCHER_HEIGHT || 1080, 10),
      URL_LAUNCHER_TITLE: process.env.URL_LAUNCHER_TITLE || 'RESIN.IO',
      URL_LAUNCHER_CONSOLE: process.env.URL_LAUNCHER_CONSOLE === '1' ? 1 : 0,
      URL_LAUNCHER_URL: process.env.URL_LAUNCHER_URL || `http://localhost:` + results.config.port,
      URL_LAUNCHER_ZOOM: parseFloat(process.env.URL_LAUNCHER_ZOOM || 1.0),
      URL_LAUNCHER_OVERLAY_SCROLLBARS: process.env.URL_LAUNCHER_CONSOLE === '1' ? 1 : 0,
    };

    // enable touch events if your device supports them
    if (electronConfig.URL_LAUNCHER_TOUCH) {
      app.commandLine.appendSwitch('--touch-devices');
    }
    // simulate touch events - might be useful for touchscreen with partial driver support
    if (electronConfig.URL_LAUNCHER_TOUCH_SIMULATE) {
      app.commandLine.appendSwitch('--simulate-touch-screen-with-mouse');
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('Running in development mode');
      Object.assign(electronConfig, {
        URL_LAUNCHER_HEIGHT: 600,
        URL_LAUNCHER_WIDTH: 800,
        URL_LAUNCHER_KIOSK: 0,
        URL_LAUNCHER_CONSOLE: 1,
        URL_LAUNCHER_FRAME: 1,
      });
    }

    /*
     we initialize our application display as a callback of the electronJS "ready" event
     */
    app.on('ready', () => {
      // here we actually configure the behavour of electronJS
      const window = new BrowserWindow({
        width: electronConfig.URL_LAUNCHER_WIDTH,
        height: electronConfig.URL_LAUNCHER_HEIGHT,
        frame: !!(electronConfig.URL_LAUNCHER_FRAME),
        title: electronConfig.URL_LAUNCHER_TITLE,
        kiosk: !!(electronConfig.URL_LAUNCHER_KIOSK),
        webPreferences: {
          nodeIntegration: !!(electronConfig.URL_LAUNCHER_NODE),
          zoomFactor: electronConfig.URL_LAUNCHER_ZOOM,
          overlayScrollbars: !!(electronConfig.URL_LAUNCHER_OVERLAY_SCROLLBARS),
        },
      });

      window.webContents.on('did-finish-load', () => {
        setTimeout(() => {
          window.show();
        }, 300);
      });

      // if the env-var is set to true,
      // a portion of the screen will be dedicated to the chrome-dev-tools
      if (electronConfig.URL_LAUNCHER_CONSOLE) {
        window.openDevTools();
      }

      // the big red button, here we go
      window.loadURL(electronConfig.URL_LAUNCHER_URL);
    });

  })
  