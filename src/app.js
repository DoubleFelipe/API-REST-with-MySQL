const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger/swagger');

const app = express();

app.use(cors());
app.use(express.json());

// Rota da documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.log(err));

const routes = require('./routes/routes');
app.use(routes);

module.exports = app;