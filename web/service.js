var ARROW_ARG = /^([^(]+?)=>/;
var FN_ARGS = /^[^(]*\(\s*([^)]*)\)/m;
var FN_ARG_SPLIT = /,/;
var FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

function stringifyFn(fn) {
    return Function.prototype.toString.call(fn);
}

function extractArgs(fn) {
    var fnText = stringifyFn(fn).replace(STRIP_COMMENTS, ''),
        args = fnText.match(ARROW_ARG) || fnText.match(FN_ARGS);

    return args[1].replace(' ', '').split(',');
}

function describeApi(api) {
    var services = {};

    Object.keys(api).forEach((serviceName) => {
        var service = api[serviceName];
        services[serviceName] = {};

        Object.keys(service.constructor.prototype).forEach((methodName) => {
            var method = service.constructor.prototype[methodName];
            var methodArgs = extractArgs(method);

            services[serviceName][methodName] = methodArgs;
        })
    })

    return services;
};

function createHandler(api) {
    var router = require('express').Router();

    var description = describeApi(api);

    router.get('/description.json', (req, res, next) => {
        res.json(description);
    });

    router.get('/api-description.js', (req, res, next) => {
        var bundler = require('browserify')([], {});

        var apiDescriptionSource = 'module.exports = ' + JSON.stringify(description, null, 2) + ';';

        bundler.require(
            require('string-to-stream')(apiDescriptionSource),
            {
                source: apiDescriptionSource,
                expose: 'api-description'
            })

        bundler.bundle((err, src) => {
            if (err) return next(err);

            res.set('content-type', 'text/javascript');
            res.send(src);
            res.end();
        })
    });

    router.post('/:service/:method', (req, res, next) => {
        try {
            var service = api[req.params.service];
            var args = [];

            description
            [req.params.service]
            [req.params.method]
                .forEach((argName) => {
                    args.push(req.body[argName]);
                });

            var method = service.constructor.prototype[req.params.method];

            method
                .apply(service, args)
                .then(
                (result) => res.json(result),
                (err) => next(err || new Error('error invoking ' + req.params.service + '.' + req.params.method))
                );
        } catch (e) {
            next(err || new Error('error invoking ' + req.params.service + '.' + req.params.method));
        }
    });

    return router;
}

module.exports = {
    describeApi: describeApi,
    createHandler: createHandler
}