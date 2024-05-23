const jwt = require('jsonwebtoken');
const JWT_SECRET = "AmitGoodB$oy";

const fetchuser = (req,res,next) => {
    //Get the user from the jwt token and add id to req object--
    const token = req.header("auth-token");
    if(!token){
        res.status(401).json({error : "Please authenticate using a vaild token"});
    }try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
    } catch (error) {
        res.status(401).json({error : "Please authenticate using a vaild token"});
    }
    next(); 
}

module.exports = fetchuser