const express=require("express");
const cors=require("cors");
require("dotenv").config();

const {connection}=require("./configs/db");
const {userRouter}=require("./routes/user.routes");
const {blogRouter}=require("./routes/blog.routes");

const {authenticator}=require("./middlewares/authenticator");

const app=express();

app.use(express.json());
app.use(cors());

app.get("/",(req,res)=>{
 res.send("Welcom to Blog Database");
});

app.use("/api",userRouter);
app.use(authenticator)
app.use("/api/blogs",blogRouter);

app.listen(process.env.PORT,async ()=>{
 try {
  await connection;
  console.log("db connected")
 } catch (error) {
  console.log("db not connected")
 }
 console.log(`server started at port ${process.env.PORT}`)
})