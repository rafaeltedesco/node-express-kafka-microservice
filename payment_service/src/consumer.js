const kafka = require('kafka-node');
const axios = require('axios');
const dns = require('dns/promises');

const { Consumer } = kafka;
const client = new kafka.KafkaClient({ kafkaHost: 'kafka: 9092'})


const consumer = new Consumer(client, [
  { topic: 'verify_payment'},
], { autoCommit: false })

consumer.on('message', (message) => {
  const newOrder = JSON.parse(message.value);
  setTimeout(async () => {
    const id = newOrder.id;
    const status = 'approved';
    const host = await dns.resolve('orders_service');
    try {
      await axios.patch(`http://${host}:3000/update-order-status/${id}`, { status })
      console.log(`payment status change to approved in order with id ${id}`)
      consumer.commit((err, data) => {
        if (err) {
          console.error('Error while commiting:', err.message);
        }
        else {
          console.log('Offset commited', data);
        }
      })
    }
    catch (err) {
      console.error('Cannot send to api right now!');
    }
  }, 5_000 + Math.random() * 15_000)
})