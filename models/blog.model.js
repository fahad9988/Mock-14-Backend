const mongoose=require("mongoose");

const blogSchema=mongoose.Schema({
 username:{type:String,required:true},
 title:{type:String,required:true},
 content:{type:String,required:true},
 category:{type:String,required:true},
 date:{type:String,required:true},
 likes:{type:Number,required:true},
 comments:{type:Array,required:true},
 userID:{type:String}
});

const BlogModel=mongoose.model("blog",blogSchema);

module.exports={
 BlogModel
}