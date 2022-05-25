/**This app.js file holds the express app */
const path = require("path");
const express = require('express');//installs express
const bodyParser = require('body-parser');//so the app can parse information sent from client
const mongoose = require('mongoose');
require('dotenv').config();//can pass in config js object {path: path/filename}
const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');
//const MONGO_ATLAS_PW = 'Jamall'
const app = express();//create object  app of express.
/** This object has middleware tools that we want to use to applyy to incomming requests*/

mongoose.connect(`mongodb+srv://tony:`+process.env.MONGO_ATLAS_PW+`@cluster0-usequ.mongodb.net/angular-post?retryWrites=true&w=majority`,
{useNewUrlParser: true, useUnifiedTopology: true})
  .then(() =>{
    console.log('Connected to the data base boss!');
  })
  .catch((err) => {
    console.log('Something is wrong boss! NOT CONNECTED! ' + err);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/images', express.static(path.join("images")));

app.use((req, res, next) =>{
  res.setHeader('Access-Control-Allow-Origin', '*');//allows any clients access server resource/data from anywhere
  res.setHeader('Access-Control-Allow-Headers',// even with these specific headers
  'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods',//allows these http methods to be used
  'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  next();
});

app.use('/api/posts', postsRoutes);
app.use('/api/user', userRoutes);


//code to connect express middleware to node.js server
module.exports = app;
