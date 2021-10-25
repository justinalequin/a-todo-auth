const {isEmail} = require("validator")

function validateLoginData(req, res, next){

    const {email} = req.body;
    let errObj = {};

    if (!isEmail(email)) {
        errObj.email = "please enter a valid email";
      }
      
      if (Object.keys(errObj).length > 0) {
        //How would you validate firstName to make sure only alphabet is allowed
        return res.status(500).json({
          message: "error",
          error: errObj,
        });
  
      } else {
          next();
      }

}

module.exports = {
    validateLoginData,
}