import express from "express";
import { postRouter } from "./modules/post/post.router";
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";

const app = express();
app.use(express.json())
app.use("/api/auth", (req, res) => {
    // এটি /api/auth দিয়ে শুরু হওয়া সব রিকোয়েস্ট হ্যান্ডেল করবে
    return toNodeHandler(auth)(req, res);
});

app.get("/",(req,res)=>{
    res.send("Server is running on the successfully")
})


app.use("/posts",postRouter)


export default app;

