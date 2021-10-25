var bcrypt = require('bcryptjs');
const User = require('../model/User');


function checkForNumberAndSymbol(target){

    if (target.match(/[!`\-=@#$%^&*()\[\],.?":;{}|<>1234567890]/g)){
        return true;
    } else {
        return false;
    }

}

function checkIsEmpty(target){
    if(target.length === 0){
        return true;    
    } else{
        false;
    }
}

function checkSymbol(target){
    if (target.match(/[!`\-=@#$%^&*()\[\],.?":;{}|<>]/g)){
        return true;
    } else {
        return false;
    }
}

function checkEmail(target){

    if (target.includes("@" && ".")){
        return false;
    } else {
        return true;
    }
}

function checkPassword(target){
    var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

    if(strongRegex.test(target)){
        return false
    } else {
        return true
    }
}


async function createUser(req, res) {
    const { firstName, lastName, username, email, password } = req.body;
    let body = req.body;
    //How would you validate firstName to make sure only alphabet is allowed
    let errObj = {};
  
    for (let key in body) {
      if (checkIsEmpty(body[key])) {
        errObj[`${key}`] = `${key} cannot be empty`;
      }
    }
  
    if (checkForNumberAndSymbol(firstName)) {
      errObj.firstName = "First Name cannot have special characters or numbers";
    }
  
    if (checkForNumberAndSymbol(lastName)) {
      errObj.lastName = "last Name cannot have special characters or numbers";
    }

    if (checkSymbol(username)){
        errObj.username = "Username cannot have special characters";
    }


    if (checkEmail(email)){
        errObj.email = "Email must be in valid format.";
    }

    if (checkPassword(password)){
        errObj.password = "Password did not meet requirements. Please try again.";
    }



  
    if (Object.keys(errObj).length > 0) {
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
  

const updateUser = async (req, res) =>{
    try{
        let updatedUser = await User.findByIdAndUpdate(id, req.body, req.params, {new: true,});
        res.json({message: "success", payload: updatedUser})
    } catch(error){
        res.status(500).json({message: "failure", message: error.message})
    }
}

const deleteUser = async (req, res) =>{
    try{
        const {id} = req.params;
        let payload = await User.findByIdAndDelete(req.params, id,)
        res.json({message: "success", payload});
    } catch(error){
        res.status(500).json({message: "failure", message: error.message})
    }
}

const fetchUser = async (req, res) =>{
    try{
        let payload = await User.find(req.body);
        res.json({message: "success", payload});
    } catch(error){
        res.status(500).json({message: "failure", message: error.message})
    }
}

module.exports = {
    createUser, updateUser, deleteUser, fetchUser,
}


