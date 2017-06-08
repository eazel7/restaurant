module.exports = function (results) {
    const electron = require('electron');

    const { app, BrowserWindow } = electron;

    // simple parameters initialization
    const electronConfig = {
        URL_LAUNCHER_TOUCH: process.env.URL_LAUNCHER_TOUCH === '1' ? 1 : 0,
        URL_LAUNCHER_TOUCH_SIMULATE: process.env.URL_LAUNCHER_TOUCH_SIMULATE === '1' ? 1 : 0,
        URL_LAUNCHER_FRAME: process.env.URL_LAUNCHER_FRAME === '1' ? 1 : 0,
        URL_LAUNCHER_KIOSK: process.env.URL_LAUNCHER_KIOSK === '1' ? 1 : 0,
        URL_LAUNCHER_NODE: process.env.URL_LAUNCHER_NODE === '1' ? 1 : 0,
        URL_LAUNCHER_WIDTH: parseInt(process.env.URL_LAUNCHER_WIDTH || 1920, 10),
        URL_LAUNCHER_HEIGHT: parseInt(process.env.URL_LAUNCHER_HEIGHT || 1080, 10),
        URL_LAUNCHER_TITLE: process.env.URL_LAUNCHER_TITLE || 'Restaurant',
        URL_LAUNCHER_CONSOLE: process.env.URL_LAUNCHER_CONSOLE === '1' ? 1 : 0,
        URL_LAUNCHER_URL: process.env.URL_LAUNCHER_URL || `http://localhost:` + results.config.port + results.config.browser,
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

    // if the env-var is set to true,
    // a portion of the screen will be dedicated to the chrome-dev-tools
    if (electronConfig.URL_LAUNCHER_CONSOLE) {
        window.openDevTools();
    }

    window.webContents.on('did-finish-load', () => {
        setTimeout(() => {
            window.show();
        }, 300);
    });

    // the big red button, here we go
    window.loadURL(electronConfig.URL_LAUNCHER_URL);
};