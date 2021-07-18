var amqp = require('amqplib/callback_api');

const AMQP = "amqp";
const RETRY_INTERVAL = 5000;

var _mqChannel;
var _exchange;

// this method will return amqp connection params
// based on the configuration
function _getConnectionParams(env) {
  return {
    connectionString: `${AMQP}://${env.amqp.host}`,
    exchange: env.amqp.exchange,
    exchangeType: env.amqp.exchangeType
  };
}

function _handleUnexpectedClose(appConfig) {
  console.error("[AMQP] reconnecting");
  return setTimeout(connectToMQ, RETRY_INTERVAL, appConfig);
}

function connectToMQ(appConfig) {
  console.log("Connecting to message queue...");
  const {
    connectionString, exchange, exchangeType
  } = _getConnectionParams(appConfig);

  amqp.connect(connectionString, function(error0, connection) {
    if (error0) {
      console.log("Unable to connect to AMQP");
      console.error(error0);
      _handleUnexpectedClose(appConfig);
      return;
    }
    // handle error | close event
    connection.on("error", ()=>_handleUnexpectedClose(appConfig));
    connection.on("close", ()=>_handleUnexpectedClose(appConfig));

    // create channel
    connection.createChannel(function(error1, channel) {
      if (error1) {
        console.log("Unable to create AMQP channel");
        console.error(error1);
        return
      } else {
        console.log(`Connected to MQ successfully`);
      }

      // create exchange
      channel.assertExchange(exchange, exchangeType, {
        durable: false
      }, callback = (error2)=>{
        if(error2) {
          console.log("Unable to create AMQP exchange");
          // _mqChannel = null; 
        }
      });

      // expose channel and exchange
      _mqChannel = channel;
      _exchange = exchange;
    });
  });  
};


module.exports.publishMessage = (msg) => {
  // send if initialized
  _mqChannel && _mqChannel.publish(_exchange, '', Buffer.from(msg));
  console.log("Sent %s", msg);
}

module.exports.connectToMQ = connectToMQ