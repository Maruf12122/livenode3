const mongooes  = require("mongoose");

mongooes.connect("mongodb://localhost:27017/bloge")


const contactschema = mongooes.Schema({
    email:String,
    subject:String,
    message:String
})

module.exports = mongooes.model("contact",contactschema)