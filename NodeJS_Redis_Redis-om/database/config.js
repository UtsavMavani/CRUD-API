const { Client } = require('redis-om');

const client = new Client();

client.open(process.env.REDIS_URL)
.then(() => {
  console.log('Database connected.');
})
.catch((error) => {
  console.log('Database connection error...!', error.message);
});

module.exports = client;