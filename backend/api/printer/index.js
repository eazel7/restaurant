if (require('config').disablePrinting) module.exports = require('./stub');
else module.exports = require('./bluetooth');