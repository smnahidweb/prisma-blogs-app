import express from "express";
import { postRouter } from "./modules/post/post.router";

const app = express();
app.use(express.json())

app.get("/",(req,res)=>{
    res.send("Server is running on the successfully")
})


app.use("/posts",postRouter)



export default app;
