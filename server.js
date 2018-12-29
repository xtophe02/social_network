const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({
  extended: false,
  useNewUrlParser: true
}));
app.use(bodyParser.json());

// DB config
const db = require('./config/keys').mongoURI
//Connect to MLAB
mongoose.connect(db)
  .then(() => console.log('MLAB connected'))
  .catch(err => console.log(err))

app.get('/', (req, res) => res.send('hello'));

// Use routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', users);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})