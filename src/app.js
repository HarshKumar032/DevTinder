const express=require("express");
const app=express();

app.get("/user",(req,res)=>{
    res.send({"firstname":"harsh","lastname":"Shaw"});
})

app.post("/user",(req,res)=>{
    res.send("DB updated succesfully");
})

app.delete("/user",(req,res)=>{
    res.send("Data deleted succesfully");
})

//This app.use() will match all http call methods to /test
app.use("/test",(req,res)=>{
    res.send("Just Testing");
})

app.listen(3000,()=>{
    console.log("Server started on PORT 3000...");
});