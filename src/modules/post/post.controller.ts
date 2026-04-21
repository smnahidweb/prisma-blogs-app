import express from 'express'
import {Request,Response} from "express"
import { postService } from './post.service'
import { Post } from '../../../generated/prisma/client'
import { error } from 'node:console'
import { any, boolean, number, string } from 'better-auth'
import { paginationHelper } from '../../Helpers/paginationSortingHelper'
import { auth } from '../../lib/auth'


const postCreate = async (req:Request,res:Response)=>{
 


    try{
        
        const user = req.user;
        if(!user){
         return   res.status(401).json({
            error:"Post created fail",
             details: error   
        })
        }
        
        const result = await postService.createPost(req.body,user?.id as string)
        

        res.status(201).json(result)
    }
    catch{
        res.status(401).json({
            error:"Post created fail",
             details: error   
        })
    }


}

const getAllPost = async(req:Request,res:Response)=>{
    try{
        const{search} = req.query;

        const tags = req.query.tags ? (req.query.tags as string).split(",") : [] 
        const searchString = typeof search === 'string' ? search : undefined
        

        const options = paginationHelper.sortingPagination(req.query);
        console.log("Options",options)
        const {page,limit,skip,sortBy,sortOrder} = options;

    

        const isFeatured = req.query.isFeatured ? 
        req.query.isFeatured  === 'true' ? true 
        : req.query.isFeatured ==='false' ? false 
        : undefined 
        : undefined;

        

        const result = await postService.getAllPost({search: searchString,tags,isFeatured,page,limit,skip,sortBy,sortOrder });
        res.status(200).json(result)
        
    }
      catch{
        res.status(401).json({
            error:"Post created fail",
             details: error   
        })
    }
}


const getPostById = async (req:Request,res:Response)=>{

const {id} = req.params;
console.log(id)


    try{

        const result = await postService.getPostById(id);
        res.status(200).json(result)    
    }

    catch{
        res.status(401).json({
            error:"Post created fail",
             details: error   
        })
    }
}


const getPostByAuthor = async (req: Request, res: Response) => {
 
    console.log("Get post by author controller called");
        console.log("userId from token" , req.user);

    if (!req.user) {
        return res.status(401).json({ error: "You are not authorized" });
    }

    
    const authorId = req.user.id;
  const result = await postService.getPostByAuthorId(authorId);
    res.status(200).json(result);

}

//UPDATE OWN POST
    const updateOwnPost = async (req:Request,res:Response)=>{
        const {id} = req.params
        const authorId = req.user?.id;
        const isAdmin = req.user?.role === 'ADMIN';
      try{
          const result = await postService.updateOwnPost(id as string,req.body,authorId as string,isAdmin as boolean);
          res.status(200).json(result)
      }
      catch{
        res.status(401).json({
            error:"Post update fail",
             details: error   
        })
    }
    
    }


    //DELETE POST BY AUTHOR AND ADMIN

    const deletePost = async (req:Request,res:Response)=>{

        const {id} = req.params
        const authorId = req.user?.id;
        const isAdmin = req.user?.role === 'ADMIN';

        try{

             const result = await postService.deletePost(id as string,authorId as string,isAdmin as boolean);
                res.status(200).json(result)


        }
        catch (error) { // এখানে error রিসিভ করতে হবে
    res.status(401).json({
        error: "Post delete fail",
        details: error instanceof Error ? error.message : error
    });
}

    }

    
export const postController = { 
    postCreate,
    getAllPost,
    getPostById,
    getPostByAuthor,
    updateOwnPost,
    deletePost
}
