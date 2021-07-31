const mangoose = require("mongoose");

const diarySchema = new mangoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    }
})

module.exports = mangoose.model('Diary',diarySchema);