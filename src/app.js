const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger/swagger');

const app = express();

app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.log(err));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

const routes = require('./routes/routes');
app.use(routes);

module.exports = app;
