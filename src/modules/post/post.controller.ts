import express from 'express'
import {Request,Response} from "express"
import { postService } from './post.service'
import { Post } from '../../../generated/prisma/client'
import { error } from 'node:console'
import { any, boolean, number } from 'better-auth'
import sortingPagination from '../../Helpers/paginationSortingHelper'

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
        
        const page = Number(req.query.page ?? 0);
        const limit = Number(req.query.limit ?? 10)

        const option = sortingPagination(req.query)
        
        const skip = (page -1)*limit;

        const sortBy = req.query.sortBy as string | undefined;
        const sortOrder = req.query.sortOrder as string | undefined;

        const isFeatured = req.query.isFeatured ? 
        req.query.isFeatured  === 'true' ? true 
        : req.query.isFeatured ==='false' ? false 
        : undefined 
        : undefined;

        console.log(isFeatured)

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

export const postController = {
    postCreate,
    getAllPost
}