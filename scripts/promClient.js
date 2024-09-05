const express = require('express');
const { collectDefaultMetrics, register } = require('prom-client');
collectDefaultMetrics();
const startMetricsServer = () => {
  const app = express();
  app.get('/metrics', async (_req, res) => {
    try {
      res.set('Content-Type', register.contentType);
      res.end(await register.metrics());
    } catch (err) {
      res.status(500).end(err);
    }
  });
  app.listen(4001, '0.0.0.0');
};
module.exports = { startMetricsServer };
