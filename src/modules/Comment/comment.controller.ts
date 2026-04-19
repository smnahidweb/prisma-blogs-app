import { Request, Response } from "express";
import { commentService } from "./comment.service";

const createComment = async(req:Request,res:Response)=>{
   
    try{
         const user = req.user;
        req.body.authorId = user?.id;
        const result = await commentService.createComment(req.body);

        res.status(200).json(result)
        
    }
    catch (error) {
        console.log("Error in controller:", error); 
        res.status(500).json({
            error: "Comment creation failed"
        });
    }

}

export const commentController = {
    createComment
}
