const express = require('express');
const db = require('./models');
const app = express();

db.sequelize.sync({
  force: true,
});

app.listen(5555, () => console.log('server is running on port 5555'));
