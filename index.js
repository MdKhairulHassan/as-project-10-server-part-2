const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'FinEase server is working!',
  });
});

module.exports = app;
