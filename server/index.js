// nodemon:
// automatically reload your entire project whenever any 
// of the source code inside of your project is changed.
const keys = require( './keys' ) ;

// Express App Setup
const express    = require( 'express' ) ;
const bodyParser = require( 'body-parser') ;
const cors       = require('cors') ;
const app        = express() ;

app.use (cors()) ;
app.use ( bodyParser.json()) ;


// Postgres Client Setup
const { Pool } = require('pg');
const pgClient = new Pool({
    host: keys.pgHost,
    port: keys.pgPort,
    database: keys.pgDatabase,
    user: keys.pgUser,
    password: keys.pgPassword
});

pgClient.on('error' , () => console.log ( 'Lost PG connection' ));

//  delay the table query until after a connection is made
pgClient.on("connect", (client) => {
    client
      .query("CREATE TABLE IF NOT EXISTS values (number INT)")
      .catch((err) => console.error(err));
});

// Redis Client Setup
const redis = require ( 'redis') ;
const redisClient = redis.createClient({
  host : keys.redisHost ,
  port : keys.redisport ,
  retry_strategy : () => 1000,
});

// we have to make a duplicate connection
// because when a connection is turned
// into a connection that's going to listen
// or subscribe or publish information
// it cannot be used for other purposes.
const redisPublisher = redisClient.duplicate();

// Express route handlers

app.get("/", (req, res) => {
    res.send("Hi");
  });
  
app.get("/values/all", async (req, res) => {
  const values = await pgClient.query("SELECT * from values");

  res.send(values.rows);
});

app.get("/values/current", async (req, res) => {
  redisClient.hgetall("values", (err, values) => {
    res.send(values);
  });
});

app.post("/values", async (req, res) => {
  const index = req.body.index;

  if (parseInt(index) > 40) {
    return res.status(422).send("Index too high");
  }

  redisClient.hset("values", index, "Nothing yet!");
  redisPublisher.publish("insert", index);
  pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);

  res.send({ working: true });
});

app.listen(5000, (err) => {
  console.log("Listening");
});
