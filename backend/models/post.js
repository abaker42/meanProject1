/**This file structures the data on  the backend. Allows us to define how the db receives data*/
const mongoose = require('mongoose');

//create a schema of the data you want to persist. Able to use meta data like required and default
const postSchema = mongoose.Schema({
  title: { type: String, required: true},
  content: { type: String, default: 'Default Message'},
  imagePath: {type: String, required: true},
  creator: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}
});

// creates data/model/object from the mongoose.Schema
//we export the model to be used outside of file
module.exports = mongoose.model('Post', postSchema);
