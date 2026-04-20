import { Request, Response } from "express";
import { commentService } from "./comment.service";
import { string } from "better-auth";

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


// getCommentById 

const getCommentById = async(req:Request, res:Response)=>{
    

    try{
   const {id} = req.params ;

   if(!id){
    return res.status(400).json({
        error:"Comment ID is required"
    })
   }

   const result = await commentService.getCommentByID({id: id as string});
   res.status(200).json(result)

    }
    catch(error){
        console.error(error)
    }

}

const getCommentsByAUthorId = async(req:Request,res:Response)=>{

    const {authorId} = req.params;

    try{
       
        const result = await commentService.getCommentsByAuthorId(authorId as string)
        return res.status(200).json(result)

    }
    catch(error){
        console.error(error)
        return res.status(500).json({
            error: "Failed to fetch comments"
        })
    }
}

export const commentController = {
    createComment,
    getCommentById,
    getCommentsByAUthorId
}
