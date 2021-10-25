const jwt = require('jsonwebtoken')

function jwtMiddleware(req, res, next){

    try{

        
        if (req.headers && req.headers.authorization){

            let notDecodedToken = req.headers.authorization;

            let slicedToken = notDecodedToken.slice(7)

            let decodedToken = jwt.verify(slicedToken, process.env.JWT_SECRET);

            res.locals.decodedData = decodedToken

            next();



        //If token is valid
        //go to the next middleware 
        // making sure first name, last name, username, password are not empty 
        // making each field has a correct validation (refer back to previous lessons)
        // Making sure confirmPassword and password are identical
        // If they dont match - send an error message to user saying "Password and confirmPassword must match"
        // If every fields are correct allow the user to update

        } else{
            throw { message: "You don't have permission"}
        }


       

    } catch (e){
        res.status(500).json({message: "error", error: e.message})
    }

}

module.exports = {
    jwtMiddleware
}