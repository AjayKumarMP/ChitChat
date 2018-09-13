var log4js = require('log4js');

// log4js.configure({
//     appenders: {
//         cheese: { type: 'file', filename: './app.log' },
//         casual: { type: 'file', filename: './casual.log' }
//     },
//     categories: {
//         default: { appenders: ['cheese'], level: 'error' },
//         norma: { appenders: ['casual'], level: 'debug' }
//     }
// });

var logger = log4js.getLogger();
// var normalLogger = log4js.getLogger('casual');

module.exports = logger;
// module.exports.normalLogger = normalLogger;