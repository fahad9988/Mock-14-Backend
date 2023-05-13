const jwt=require("jsonwebtoken");

const authenticator=(req,res,next)=>{
 const token=req.headers.authorization;
 if(token){
  var decoded = jwt.verify(token, 'masai');
  if(decoded){
   req.body.userID=decoded.userID;
   next();
  }else{
   res.send({"msg":"You are not authorized"})
  }
 }else{
  res.send({"msg":"You are not authorized"})
 }
}

module.exports={
 authenticator
}