const CustomError=require('../Utils/CustomError')

const errorHandler=(err,req,res,next)=>{
 
    if(err instanceof CustomError){
        
        return res.status(err.statusCode).json({message:err.message,errCode:err.errCode})
    }
   console.error(err);
    return res.status(500).send('something went wrong'+err) 
}

module.exports=errorHandler