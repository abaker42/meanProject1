const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
//create a schema of the data you want to persist. Able to use meta data like required and default
const userSchema = mongoose.Schema({
  email: {type: String, required: true, unique: true },
  password: {type: String, required: true}
});

//plugin uniqueValidator into userSchema so emails unique attr can be validated
userSchema.plugin(uniqueValidator);
// creates data/model/object from the mongoose.Schema
//we export the model to be used outside of file
module.exports = mongoose.model('User', userSchema);
