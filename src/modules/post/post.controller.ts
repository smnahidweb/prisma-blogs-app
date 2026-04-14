import express from 'express'
import {Request,Response} from "express"
import { postService } from './post.service'
import { Post } from '../../../generated/prisma/client'
import { error } from 'node:console'

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
        const searchString = typeof search === 'string' ? search : undefined

        const result = await postService.getAllPost({search: searchString});
        res.status(200).json(result)
        
    }
      catch{
        res.status(401).json({
            error:"Post created fail",
             details: error   
        })
    }
}

export const postController = {
    postCreate,
    getAllPost
}