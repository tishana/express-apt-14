// Dependencies
const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const cors = require('cors')
const db = mongoose.connection
const Todos = require('./models/todos.js');
const todosData = require('./utilities/data');

// Environment Variables
const app = express();
const mongoURI = process.env.MONGODB_URI
const PORT = process.env.PORT || 3001

// Connect to Mongo
mongoose.connect(mongoURI, { useNewUrlParser: true },
  () => console.log('MongoDB connection established:', mongoURI)
)


// Error / Disconnection
db.on('error', err => console.log(err.message + ' is Mongod not running?'))
db.on('disconnected', () => console.log('mongo disconnected'))

// Middleware
app.use(express.urlencoded({ extended: false }))// extended: false - does not allow nested objects in query strings
app.use(express.json()); //use .json(), not .urlencoded()
app.use(express.static('public')) // we need to tell express to use the public directory for static files... this way our app will find index.html as the route of the application! We can then attach React to that file!
app.use(cors())

// Routes
const todosController = require('./controllers/todos.js');

app.use('/todos', todosController);
app.get('/seed', async (req, res) => {
  await Todos.deleteMany({});
  await Todos.insertMany(todosData);
  res.send('done!');
});

app.listen(PORT, () => {
  console.log('This message means nothing', PORT)
})