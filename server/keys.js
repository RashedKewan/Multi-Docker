module.exports = {
    // CONNECTING TO REDIS VIA ITS HOST:PORT
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT,
    // CONNECTING TO POSTGRESS VIA ITS HOST:PORT
    pgHost: process.env.PGHOST,
    pgPort: process.env.PGPORT,
    
    pgDatabase: process.env.PGDATABASE,
    pgUser: process.env.PGUSER,
    pgPassword: process.env.PGPASSWORD,
    
};