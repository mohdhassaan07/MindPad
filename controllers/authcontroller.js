const usermodel = require("../models/user");
const bcrypt = require("bcrypt");
const {generateToken, sendMail} = require("../utils/generateToken");

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let user = await usermodel.findOne({ email: email });
        if (user) {
            res.send("U already have account");
            return res.status(401).redirect("/");
        }
        bcrypt.genSalt(10, function (err, salt) {
            if (err) return res.send(err.message);
            bcrypt.hash(password, salt, async function (err, hash) {
                const user = await usermodel.create({
                    name,
                    email,
                    password: hash
                });
                let token = generateToken(user);
                res.cookie("token", token);
                // sendMail(user);
                res.redirect("/notes");
            });
        });

    } catch (err) {
        console.log(err);
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await usermodel.findOne({ email: email });

        if (!user) {
            res.send("Email or password incorrect");
            // return res.redirect("/");
        }
        else {
            let hash = user.password;
            bcrypt.compare(password, hash, function (err, result) {
                if (result) {
                    let token = generateToken(user);
                    res.cookie("token", token);
                    res.redirect("/notes");    
                } else {
                    res.send("Email or password incorrect");
                    return res.status(401).redirect("/");
                }
            });
        }
    } catch (error) {
        console.log(error);
    }
}

const logoutUser = (req,res)=>{
    res.cookie("token", "");
    res.redirect("/");
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser
}