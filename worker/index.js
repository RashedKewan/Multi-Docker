const keys = require("./keys");
const redis = require("redis");

const redisClient = redis.redisClient({
    host: keys.redisHost,
    port: keys.redisPort,
    // if it lose the connection to the redis server after every 1 ms
    retry_strategy: () => 1000,
});

// subscribtion
const sub = redisClient.duplicate();

// fibunaci function
function fib(index){
    if( index < 2 ) return 1;
    return fib( index -1 ) + fib( index - 2 );
}

sub.on('message' , (channel , message) => {
    // hash set with name : values
    // insert  key : value
    // key   : message => the input number
    // value : its fib value
    redisClient.hset('values' , message , fib(parseInt(message)));
});

// subscribe to any insert event
sub.subscribe('insert');