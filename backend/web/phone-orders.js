const Browserify = require('browserify');
const express = require('express');
const PhoneOrdersAPI = require('../client/phone-orders/api');

function PhoneOrdersApp(clientConfig, api) {
    return new Promise(
        (resolve, reject) => {
            var app = express.Router();

            var deps = ['jquery', 'angular', 'angular-material', 'angular-material-icons', 'angular-ui-router', 'angular-simple-logger', 'ui-leaflet'];

            var phoneOrdersApi = new PhoneOrdersAPI(api);
            var apiDescription = require('./service').describeApi(phoneOrdersApi);

            app.use('/service', require('./service').createHandler(phoneOrdersApi));

            var bundleDeps = () => {
                return new Promise(
                    (resolve, reject) => {
                        console.log('building phone-orders deps.js')

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
                                console.error('error building phone-orders deps.js');
                                console.error(err);

                                return reject(err);
                            }

                            console.log('done building phone-orders deps.js')

                            app.get('/deps.js', (req, res, next) => {
                                res.set('content-type', 'text/javascript');
                                res.send(buf.toString());
                                res.end();
                            });

                            resolve();
                        });
                    }
                )
            }

            app.get('/app.js', (req, res, next) => {
                var bundler = Browserify([], {
                    debug: true
                });

                deps.forEach((dep) => bundler.external(dep));

                var configSource = 'module.exports = ' + JSON.stringify(clientConfig, null, 2) + ';';
                var apiDescriptionSource = 'module.exports = ' + JSON.stringify({
                    baseUrl: '/phone-orders',
                    apis: apiDescription
                }, null, 2) + ';';

                bundler.require(
                    require('string-to-stream')(configSource),
                    {
                        source: configSource,
                        basedir: require('path').resolve(__dirname, '..', 'client', 'phone-orders'),
                        expose: 'config'
                    })
                bundler.require(
                    require('string-to-stream')(apiDescriptionSource),
                    {
                        source: apiDescriptionSource,
                        basedir: require('path').resolve(__dirname, '..', 'client', 'phone-orders'),
                        expose: 'api-description'
                    })
                bundler.ignore('config');
                bundler.ignore('api-description');

                bundler.transform(
                    require('stringify'),
                    {
                        appliesTo: { includeExtensions: ['.html'] }
                    }
                );

                bundler.add(require.resolve('../client/phone-orders'), { debug: true });

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

            app.get('/picture/:pictureId', (req, res, next) => {
                api.menu.getPicture(req.params.pictureId).then((buffer) => {
                    res.send(buffer);
                    res.end();
                }, (err) => next(err || new Error()))
            })

            app.get('/', (req, res, next) => {
                var html = require('fs').readFileSync(require.resolve('../client/phone-orders/index.html'));

                res.set('content-type', 'text/html');
                res.send(html);
                res.end();
            });

            app.get('/favicon.ico', (req, res, next) => {
                res.set('content-type', 'image/x-icon');
                res.send(require('fs').readFileSync(require.resolve('../client/phone-orders/favicon.ico')));
                res.end();
            });

            return bundleDeps().then(() => resolve(app), (err) => reject(err));
        }
    );
}

module.exports = PhoneOrdersApp;