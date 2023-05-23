const app = require('./app');

const PORT = process.env.PORT;

if (!PORT) {
  console.error('PORT is not set');
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Server up and running on PORT ${PORT}`);
})