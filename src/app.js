const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerUiDist = require('swagger-ui-dist');
const specs = require('./swagger/swagger');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Servir os assets explicitamente evita 404 no ambiente do Render.
app.use('/api-docs', express.static(swaggerUiDist.getAbsoluteFSPath(), { index: false }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

const routes = require('./routes/routes');
app.use(routes);

module.exports = app;
