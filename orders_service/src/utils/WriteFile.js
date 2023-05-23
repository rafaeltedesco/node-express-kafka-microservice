const fs = require('fs/promises');
const path = require('path');

const writeOrdersFile = async (data) => {
  const ORDERS_PATH = path.resolve('src', 'data', 'orders.json');
  await fs.writeFile(ORDERS_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

module.exports = {
  writeOrdersFile
}