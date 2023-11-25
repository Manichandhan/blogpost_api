require('dotenv').config() 
const jwt=require('jsonwebtoken')
async function tokenExpired(token,refreshtoken){
    let tokenexp={}
    const currtime=Math.floor(Date.now()/1000)
if(token){
    const decode=jwt.decode(token,process.env.TokenSecret)
   
    if(decode.exp<currtime){
        tokenexp.token=true
    }else{
        tokenexp.token=false
    }
}else{
    tokenexp.token=true
}
if(refreshtoken){
    const decode=jwt.decode(refreshtoken,process.env.RefreshSecret)
    console.log(decode.exp);
    if(decode.exp<currtime){
        tokenexp.refreshtoken=true
    }else{
        tokenexp.refreshtoken=false
    }
}else{
    tokenexp.refreshtoken=true
}
return tokenexp
}

module.exports={tokenExpired}