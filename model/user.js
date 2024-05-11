const mongooes = require("mongoose");


const userschema = mongooes.Schema({
    username:String,
    email:String,
    password:String
})

module.exports = mongooes.model("user",userschema)