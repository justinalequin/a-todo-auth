var bcrypt = require('bcryptjs');
const User = require('../model/User');
const {
    isEmpty,
    isAlpha,
    isAlphanumeric,
    isEmail,
    isStrongPassword,
  } = require('validator');

  async function createUser(req, res) {
    const { firstName, lastName, username, email, password } = req.body;
    let body = req.body;
    let errObj = {};
  
    for (let key in body) {
      if (isEmpty(body[key])) {
        errObj[`${key}`] = `${key} cannot be empty`;
      }
    }
  
    if (!isAlpha(firstName)) {
      errObj.firstName = "First Name cannot have special characters or numbers";
    }
  
    if (!isAlpha(lastName)) {
      errObj.lastName = "Last Name cannot have special characters or numbers";
    }
  
    if (!isAlphanumeric(username)) {
      errObj.username = "Username cannot have special characters";
    }
  
    if (!isEmail(email)) {
      errObj.email = "please enter a valid email";
    }
  
    if (!isStrongPassword(password)) {
      errObj.password =
        "Your password must contain 1 lowercase, 1 uppercase, 1 number, 1 special character and at least 8 characters long";
    }
  
    if (Object.keys(errObj).length > 0) {
      //How would you validate firstName to make sure only alphabet is allowed
      return res.status(500).json({
        message: "error",
        error: errObj,
      });
    }
  
    try {
      let salt = await bcrypt.genSalt(10);
      let hashed = await bcrypt.hash(password, salt);
  
      const createdUser = new User({
        firstName,
        lastName,
        username,
        email,
        password: hashed,
      });
  
      let savedUser = await createdUser.save();
  
      res.json({ message: "success", payload: savedUser });
    } catch (error) {
      res.status(500).json({ message: "error", error: error.message });
    }
  }

  async function login(req, res){
    //log the user using email and password
    //if email does not exist, error message "please go sign up"
    //if email exists but wrong password error message "please check your email and password"
    //if successful - for now send message "login success"
    const {email, password} = req.body;

    let errObj = {};

    if (isEmpty(password)){
      errObj.password = "password cannot be empty"
    }

    if (isEmpty(email)){
      errObj.email = "email cannot be empty"
    }

    if (!isEmail(email)) {
      errObj.email = "please enter a valid email";
    }
    
    if (Object.keys(errObj).length > 0) {
      //How would you validate firstName to make sure only alphabet is allowed
      return res.status(500).json({
        message: "error",
        error: errObj,
      });

    }



    res.json({foundUser});

    try{

      let foundUser = await User.findOne({email: email})

      if(!foundUser){
        return res.status(500).json({
          message: "error",
          error: "please go sign up",
        });
      } else{
  
        let comparedPassword = await bcrypt.compare(password, foundUser.password);
        
        if(!comparedPassword){
          return res.status(500).json({
            message: "error",
            error: "please check your email and password",
          });
        }else{
          res.json({
            message: "success",
          });
        }

        res.json({comparedPassword});
      }

    }catch(e){
      res.status(500).json({message: "error", error: e.message});
    }
  }


module.exports = {
    createUser,
    login,
};
