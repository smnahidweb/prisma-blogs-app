import express from 'express'
import {Request,Response} from "express"
import { postService } from './post.service'
import { Post } from '../../../generated/prisma/client'
import { error } from 'node:console'
import { any, boolean, number, string } from 'better-auth'
import { paginationHelper } from '../../Helpers/paginationSortingHelper'


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

export const postController = {
    postCreate,
    getAllPost,
    getPostById
}