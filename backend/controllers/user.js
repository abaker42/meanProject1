const bcypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require('../models/user');

exports.createUser = (req, res, next) =>{
  bcypt.hash(req.body.password, 10)
    .then(hash =>{
      const user = new User({
        email: req.body.email,
        password: hash //req.body.password It's bad to store passwords in req body unencrypted
      });
      user.save()
        .then(result => {
          res.status(201).json({
            message: 'User Created!',
            result: result
          });
        })
        .catch( err => {
          res.status(500).json({
            message: "Email is already taken!"
          });
        });
    });
}

exports.loginUser = (req, res, next) => { //check DB to see if email exists
  let fetchedUser;
  User.findOne({email: req.body.email})//find or findOne
    .then(user => {
      //console.log(user); //test if you get user
      if (!user) {
        return res.status(401).json({
          message: 'Email or Password Invalid!'
        });
      }
      fetchedUser = user;
      return bcypt.compare(req.body.password, user.password);//password hash validation
    })
    .then(result => {
      //console.log(result); //check password comparison
      if (!result) { //if bcrypt comapre is false then deny
        return res.status(401).json({
          message: 'Email or Password Invalid!'
        });
      }
      const token = jwt.sign(//this user is authenticated create his token
        { email: fetchedUser.email, userId: fetchedUser._id},
        process.env.JWT_KEY,
        { expiresIn: "1h"}
      );
      //console.log(token);//check if token was created
      res.status(200).json({ //send info and token to fronten for further use
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    })
    .catch(err => {
       //console.log(err);// if any error then deny
        return res.status(401).json({
          message: 'Email or Password Invalid!'
        });

    });

}
