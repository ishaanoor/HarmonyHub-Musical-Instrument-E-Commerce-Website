const express = require('express');
const adminRoutes = require('./routes/admin');
require('dotenv').config();

const app = express();
app.use(express.json());

app.use('/api/v1/admin', adminRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', uptime: process.uptime() });
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`HarmonyHub API running operational on port ${PORT}`);
  });
}

module.exports = app;
