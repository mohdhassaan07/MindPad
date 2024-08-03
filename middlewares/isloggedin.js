const jwt = require("jsonwebtoken")
const usermodel = require("../models/user");

const isloggedin = async(req,res,next)=>{
    if(!req.cookies.token){
        res.send("u need to login first!!!");
    }
    try {
        let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        let user = await usermodel.findOne({email:decoded.email}).select("-password");
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
    }
}
module.exports = isloggedin;