import express from "express";

const app = express();


app.get("/",(req,res)=>{
    res.send("Server is running on the successfully")
})

export default app;
