const env:any = process.env.NODE_ENV || 'development';

const configs:any = Object.freeze({
    base: {
        env,
        host: '0.0.0.0',
        port: 4000,
        secret: "secretKey for sessions"
    },
    development: Object.freeze({
        username: 'root',
        password: 'root',
        database: 'opex',
        host: '127.0.0.1',
        dialect: 'mysql',
        port: 3000
    }),
    integration: Object.freeze({
        username: 'root',
        password: null,
        database: 'opex',
        host: '127.0.0.1',
        dialect: 'mysql',
        port: 3000
    }),
    production: Object.freeze({
        username: 'root',
        password: null,
        database: 'opex',
        host: '127.0.0.1',
        dialect: 'mysql',
        port: 3000,
        adminEmail: 'ajaykumarmp145@gmail.com',
        toEmail: 'ajaykumarmp145@gmail.com',
        mailHost: 'smtp.ethereal.email'
    })
});

var config = Object.assign(configs.base, configs[env]);

export default config;