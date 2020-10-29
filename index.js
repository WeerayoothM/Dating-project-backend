const express = require('express');
const app = express();
const db = require('./models');
const cors = require('cors')
const userRoutes = require('./routes/user')

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/auth', userRoutes)

app.listen(5555, () => console.log('server is running on port 5555'));

db.sequelize.sync({ force: false }).then(() => {
  console.log("Database is running")
});

