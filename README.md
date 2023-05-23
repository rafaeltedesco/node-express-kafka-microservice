# node-express-kafka-microservice

Simple App to explain how to use Kafka (Producer and Consumer) in a context where users can make orders with credit card, and these orders are send to some other system that has the responsibility for approve payments and request an update in the main api.

### Run With Docker 🐳

```bash
  docker compose up -d
```

### Enter orders_service container and `npm start`

```bash
  docker exec -it orders_service sh
  npm start
```

### Enter payment_service container and `npm start` also

```bash
  docker exec -it payment_service sh
  npm start
```
