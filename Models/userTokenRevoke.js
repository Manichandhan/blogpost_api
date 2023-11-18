const mongoose=require('mongoose')

const tokenSchema= new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    tokens:{
        type:Map,
        of:String,
        required:true
    },
    refreshtokens:{
        type:Map,
        of:String,
        required:true
    }
})

const tokenModel= mongoose.model('tokens',tokenSchema)

module.exports={tokenModel}