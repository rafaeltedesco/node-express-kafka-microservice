const ordersData = require('../data/orders.json');
const { writeOrdersFile } = require('../utils/WriteFile');

const findAll = async () => {
  return ordersData.orders;
}

const readOrdersFile = async () => {
  return ordersData;
}

const findByStatus = async (status) => {
  const orders = await findAll();
  return orders.filter(({ payment }) =>
    payment.status === status);
}

const findById = async (id) => {
  const order = await findAll();
  return order.find((currentOrder) => currentOrder.id === +id);
}

const create = async ({ customerId, products, payment }) => {
  const ordersData = await readOrdersFile();
  const id = ordersData.nextId++;
  const newOrder = {
    id,
    customerId,
    products,
    payment: {
      method: payment.method,
      installments: payment.installments,
      status: "waiting_approval"
      }
    }
  ordersData.orders.push(newOrder);
  await writeOrdersFile(ordersData);
  return newOrder;
}

const updatePaymentStatus = async ({ status, orderId }) => {
  const ordersData = await readOrdersFile();
  const order = ordersData.orders.find(({ id }) => id === +orderId);
  if (!order) return {
    message: 'Order does not exist'
  }
  order.payment.status = status;
  await writeOrdersFile(ordersData);
  return order;
}

module.exports = {
  findAll,
  create,
  findByStatus,
  updatePaymentStatus,
  findById,
};