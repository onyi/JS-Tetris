const mongoose = require('mongoose');

const express = require('express');
const app = express();
const users = require('./routes/api/users');

const db = require('./config/keys').mongoURI;

const passport = require('passport');

const path = require('path');

const bodyParser = require('body-parser');

const port = process.env.PORT || 5000;

const http = require('http').Server(app);
const io = require('socket.io')(http, {});


if(process.env.NODE_ENV === 'production') {
  app.use(express.static('frontend/build'));
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  })
}

mongoose
  .connect(db, { useNewUrlParser: true})
  .then( () => console.log(`Connected to MongoDB successfully!`))
  .catch( error => console.log(`${error}`));



//Configure body parser to use JSON by default
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//Configure express with passport.js
app.use(passport.initialize());
require('./config/passport')(passport);

//Configure each router component
app.use("/api/users", users);



const server = http.listen(port, () => console.log(`Server is running on port ${port}`));