const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name : String,
    email : String,
    password : String,
    notes : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "note"
    }],
})
module.exports = mongoose.model("user",userSchema);