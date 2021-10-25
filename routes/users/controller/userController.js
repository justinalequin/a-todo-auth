var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const User = require('../model/User');
const errorHandler = require("../../utils/errorHandler/errorHandler")

async function getUserInfo(req, res, next){
  try {
    const decodedData = res.locales.decodedData;
    const foundUser = await User.findOne({email: decodedData.email}).populate(
      "orderHistory", 
      "-orderOwner -_v")

    res.json({message: "success", payload: foundUser})
  } catch (e){
    res.status(500).json({message: "failure", error: errorHandler(e)});
  }
}

  async function createUser(req, res) {
    const { firstName, lastName, username, email, password } = req.body;

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
      res.status(500).json({ message: "error", error: errorHandler(error) });
    }
  }

  async function login(req, res){
    const {email, password} = req.body;

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

          let jwtToken = jwt.sign({
            email: foundUser.email,
            username: foundUser.username,

          }, process.env.JWT_SECRET,
          { expiresIn: "24h" });
       
          res.json({message: "success", payload: jwtToken})
        }


      }

    }catch(e){
      res.status(500).json({message: "error", error: e.message});
    }
  }

  async function updateUser(req, res){
    try{

      const { password } = req.body;

      // let notDecodedToken = req.headers.authorization;

      // let slicedToken = notDecodedToken.slice(7)

      // let decodedToken = jwt.verify(slicedToken, process.env.JWT_SECRET);
      const decodedData = res.locals.decodedData;
      let salt = await bcrypt.genSalt(10);
      let hashed = await bcrypt.hash(password, salt);
      req.body.password = hashed;

      let updateUser = await User.findOneAndUpdate({email: decodedData.email},
        req.body,
        {new: true});

        res.json({
          message: "success",
          payload: updateUser
        })

    } catch(e){
      res.status(500).json({message: "error", error: e.message})
    }
  }


module.exports = {
    createUser,
    login,
    updateUser,
    getUserInfo
};

//create profile route
//if the token is not valid you tell the user "invalid token, please contact support"
//if the token is valid - respons with "success" and the decoded data
//use post request to achieve this
