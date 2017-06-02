    const Browserify = require('browserify');
const express = require('express');

function KitchenApp(clientConfig) {
    var app = express.Router();

    var deps = ['jquery', 'angular', 'angular-timeago', 'angular-material', 'angular-material-icons', 'angular-socket-io' ];
    var depsBundler = Browserify([], {
    });

    deps.forEach((dep) => depsBundler.require(
        require.resolve(dep),
        {
            expose: dep
        })
    );

    depsBundler.transform(
        require('stringify'),
        {
            appliesTo: { includeExtensions: ['.html'] }
        }
    );


    depsBundler.bundle((err, buf) => {
        if (err) {
            console.error('Error generating deps script');
            console.error(err);

            process.exit(-1);
        }

        app.get('/deps.js', (req, res, next) => {
            res.set('content-type', 'text/javascript');
            res.send(buf.toString());
            res.end();

        });
    });

    app.get('/app.js', (req, res, next) => {
        var bundler = Browserify([], {
        });

        deps.forEach((dep) => bundler.external(dep));

        var configSource = 'module.exports = ' + JSON.stringify(clientConfig, null, 2) + ';';

        bundler.require(
            require('string-to-stream')(configSource),
            {
                source: configSource,
                basedir: require('path').resolve(__dirname, '..', 'client'),
                expose: 'config'
            })
        bundler.ignore('config');
        bundler.transform(
            require('stringify'),
            {
                appliesTo: { includeExtensions: ['.html'] }
            }
        );

        bundler.add(require.resolve('./client'), { debug: true });

        bundler.bundle((err, buf) => {
            if (err) return next(err);

            res.set('content-type', 'text/javacript');
            res.send(buf.toString())
            res.end();
        })
    })

    app.get('/app.css', (req, res, next) => {
        res.set('content-type', 'text/css');

        res.send([
            require.resolve('angular-material/angular-material.css'),
            require.resolve('angular-material-icons/angular-material-icons.css')
        ].map((path) => require('fs').readFileSync(path)).join('\n'));
    })

    app.get('/', (req, res, next) => {
        var html = require('fs').readFileSync(require.resolve('./client/index.html'));

        res.set('content-type', 'text/html');
        res.send(html);
        res.end();
    });

    return app;
}

module.exports = KitchenApp;