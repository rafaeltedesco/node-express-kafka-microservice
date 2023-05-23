const kafka = require('kafka-node');

const { Producer } = kafka;

const client = new kafka.KafkaClient({ kafkaHost: 'kafka:9092'});
const producer = new Producer(client);

const express = require('express');

const app = express();

app.use(express.json());

const orderModel = require('./models/orderModel');

app.get('/orders', async (req, res) => {
  const { status } = req.query;
  if (status) {
    const orders = await orderModel.findByStatus(status);
    return res.status(200).json(orders);  
  }
  const orders = await orderModel.findAll();
  return res.status(200).json(orders);
})

app.get('/orders/:id', async (req, res) => {
  const { id } = req.params;
  const order = await orderModel.findById(id);
  return res.status(200).json(order);
})

app.patch('/update-order-status/:id', async (req, res) => {
  const { status } = req.body;
  const { id: orderId } = req.params;
  console.log('New order approved: ', orderId)
  const updatedOrder = await orderModel.updatePaymentStatus({ status, orderId })
  return res.status(200).json({
    updatedOrder
  })
})

app.post('/orders', async (req, res) => {
  const { customerId, products, payment } = req.body;

  const newOrder = await orderModel.create({ customerId, products, payment });
  const payloads = [{ topic: 'verify_payment', messages: JSON.stringify(newOrder)}];
  producer.send(payloads, (err, _data) => {
    if (err) {
      console.log(err, 'err');
      return res.status(500).json({
        error: err.message
      })
    }
    console.log('new Order send to kafka with id', newOrder.id);
    return res.status(201).json({
      newOrder
    })
  })
})

module.exports = app;