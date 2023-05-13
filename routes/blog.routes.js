const express=require("express");
const {BlogModel}=require("../models/blog.model");

const blogRouter=express.Router();

blogRouter.post("/",async (req,res)=>{
 const {username,title,content,category}=req.body;
 const date = new Date();
  let currentDate= String(date.getDate()).padStart(2, '0');
  let currentMonth = String(date.getMonth()+1).padStart(2,"0");
  let currentYear = date.getFullYear();
  let value=`${currentYear}-${currentMonth}-${currentDate}`;

 try {
  const blog=new BlogModel({username,title,content,category,date:value,likes:0,comments:[],userID:req.body.userID});
  await blog.save();
  res.send({"msg":"Blog created successfully","blog":blog})
 } catch (error) {
  res.send({"err":error.message})
 }
});

blogRouter.get("/",async (req,res)=>{
 try {
  let {order,page,category,limit=5,sort="date"}=req.query;
  let queries={};
 
  if(category){
   queries.category=category;
  }

  let sorting;
  if(order){
   if(order=="asc"){
    sorting=1
   }else if(order=="desc"){
sorting=-1;
   }
  }


  let blogs=await BlogModel.find();

  if(page&&order&&category){
   blogs=await BlogModel.find({...queries}).skip((page-1)*5).limit(limit).sort({[sort]:sorting})
  }else if(order&&page){
   blogs=await BlogModel.find().skip((page-1)*5).limit(5).sort({[sort]:sorting})
  }else if(order&&category){
   blogs=await BlogModel.find({...queries}).sort({[sort]:sorting});
  }else if(page&&category){
   blogs=await BlogModel.find({...queries}).skip((page-1)*5).limit(limit)
  }else if(page){
   blogs=await BlogModel.find().skip((page-1)*5).limit(limit)
  }else if(category){
   blogs=await BlogModel.find({...queries})
  }else if(order){
   blogs=await BlogModel.find().sort({[sort]:sorting})
  }
  res.send({"blogs":blogs});
 } catch (error) {
  res.send({"err":error.message})
 }
})

blogRouter.patch("/:id",async (req,res)=>{
 const {id}=req.params;
 const payload=req.body;
 try {
  const blog=await BlogModel.findOne({_id:id});
  const blogID=blog.userID;
  const userId=req.body.userID;
  if(blogID!=userId){
   res.send({"msg":"You are not authorized"})
  }else{
   let updated=await BlogModel.findByIdAndUpdate({_id:id},payload);
   res.send({"msg":"blog updated",blogg:updated})
  }
 } catch (error) {
  res.send({"err":error.message})
 }
})

blogRouter.delete("/:id",async (req,res)=>{
 const {id}=req.params;
 
 try {
  const blog=await BlogModel.findOne({_id:id});
  const blogID=blog.userID;
  const userId=req.body.userID;
  console.log(blogID,userId)
  if(blogID!=userId){
   res.send({"msg":"You are not authorized"})
  }else{
   await BlogModel.findByIdAndDelete({_id:id});
   res.send({"msg":"blog deleted"})
  }
 } catch (error) {
  res.send({"err":error.message})
 }
});

blogRouter.patch("/:id/like",async (req,res)=>{
 const {id}=req.params;
 const payload=req.body;
 try {
  
   await BlogModel.findByIdAndUpdate({_id:id},payload);
   res.send({"msg":"blog like updated"})

 } catch (error) {
  res.send({"err":error.message})
 }
})

blogRouter.patch("/:id/comment",async (req,res)=>{
 const {id}=req.params;
 const payload=req.body;
 try {
  
   await BlogModel.findByIdAndUpdate({_id:id},payload);
   res.send({"msg":"blog comment updated"})

 } catch (error) {
  res.send({"err":error.message})
 }
})


module.exports={
 blogRouter
}



