const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const env = require('./config/env');

const reportsRoutes = require('./routes/reports.routes');
const overviewRoutes = require('./routes/overview.routes');
const logsRoutes = require('./routes/logs.routes');
const usersRoutes = require('./routes/users.routes');

const app = express();

app.use(cors({ origin: env.clientOrigin }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api/reports', reportsRoutes);
app.use('/api/overview', overviewRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/users', usersRoutes);

// 404
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

module.exports = app;
