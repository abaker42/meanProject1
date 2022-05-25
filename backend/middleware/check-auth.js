const jwt = require("jsonwebtoken");

module.exports =(req, res, next) => {
  //get token from user
  try{
  //const token = req.query.auth //from url
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token,
    process.env.JWT_KEY);
  req.userData = {//we can add new data/fields to req object. Be careful not to override existing fields
    email: decodedToken.email,
    userId: decodedToken.userId
  };
  next();
  } catch(error) {
    res.status(400).json({ message: "Auth Failed"});
  }


};
