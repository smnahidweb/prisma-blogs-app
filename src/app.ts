import express from "express";
import { postRouter } from "./modules/post/post.router";
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import morgan from "morgan"
import { commentRouter } from "./modules/Comment/comment.router";
import { notFound } from "./Middleare/notFound";

const app = express();
app.use(express.json())


app.use(cors({
        origin: process.env.APP_URL || "http://localhost:3000",
        credentials: true,
}))
app.use(morgan("dev"))
app.use("/posts", postRouter)
app.use("/comments",commentRouter)  

app.use("/api/auth", (req, res) => {
    // এটি /api/auth দিয়ে শুরু হওয়া সব রিকোয়েস্ট হ্যান্ডেল করবে
    return toNodeHandler(auth)(req, res);
});

app.get("/",(req,res)=>{
    res.send("Succussfully connected to server new changes new")
})


app.use(notFound) // এই মডিউলটি সব রিকোয়েস্টের পরে থাকবে, তাই এটি 404 হ্যান্ডেল করবে

export default app;

