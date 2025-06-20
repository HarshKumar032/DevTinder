const express=require("express");
const app=express();

app.use("/hellos",(req,res)=>{
    res.send("Hello from the server!");
})

app.use("/test",(req,res)=>{
    res.send("Just Testing");
})

app.listen(3000,()=>{
    console.log("Server started on PORT 3000...");
});