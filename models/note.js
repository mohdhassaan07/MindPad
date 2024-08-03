const mongoose = require("mongoose");

const noteSchema = mongoose.Schema({
    title : String,
    content : String,
    tags : {
        type :Array,
        default : []
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    }
})
module.exports = mongoose.model("note",noteSchema);