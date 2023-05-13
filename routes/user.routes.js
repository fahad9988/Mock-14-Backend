const express=require("express");
const {UserModel}=require("../models/user.model");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");


const userRouter=express.Router();

userRouter.post("/register",async (req,res)=>{
 const {username,avatar,email,password}=req.body;
 try {
  const exist=await UserModel.find({email});
  if(exist.length>0){
   res.send({"msg":"User already registered, Please login"});
  }else{
   bcrypt.hash(password, 5,async function(err, secure_password) {
    if(err){
     res.send({"err":err.message})
    }else{
     const user=new UserModel({username,avatar,email,password:secure_password});
     await user.save();
     res.send({"msg":"User registered successfully"});
    }
   
});
  }
 } catch (error) {
  res.send({"err":error.message})
 }
});

userRouter.post("/login",async (req,res)=>{
 const {email,password}=req.body;
 try {
  const user=await UserModel.find({email});
  if(user.length>0){
   bcrypt.compare(password, user[0].password, function(err, result) {
    if(result){
     var token = jwt.sign({ userID: user[0]._id }, 'masai');
     res.send({"msg":"Logged in Successfully","token":token,userID: user[0]._id,username:user[0].username});
    }else{
     res.send({"msg":"Invalid Credentials"})
    }
});
  }else{
   res.send({"msg":"Invalid Credentials"})
  }
 } catch (error) {
  res.send({"err":error.message})
 }
});

userRouter.patch("/users/:id/reset",async (req,res)=>{
 const {id}=req.params;
 const {current_password,new_password}=req.body;
 try {
  const user=await UserModel.find({_id:id});
  if(user.length>0){
   bcrypt.compare(current_password, user[0].password,async function(err, result) {
    if(result){
      bcrypt.hash(new_password, 5,async function(err, secure_password) {
        if(err){
         res.send({"err":err.message})
        }else{
          await UserModel.findByIdAndUpdate({_id:id},{password:secure_password});
          res.send({"msg":"Password updated successfully"})
        }
       
    });
     
    }else{
     res.send({"msg":"Please Enter correct current password"})
    }
});
  }else{
   res.send({"msg":"User doesnt exist"})
  }
 } catch (error) {
  res.send({"err":error.message});
 }
})



module.exports={
 userRouter
}