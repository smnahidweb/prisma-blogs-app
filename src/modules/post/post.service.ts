import { AnyMxRecord } from "node:dns";
import { Post } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { skip } from "node:test";
import { SortOrder } from "../../../generated/prisma/internal/prismaNamespace";

const createPost = async (data:Omit<Post,"id"|"createdAt"|'updatedAt' | "authorId">,userId:string)=>{

    const result = await prisma.post.create(
        {
           data:{
            ...data,
            authorId:userId
           }
        }
    )

    return result;

}

const getAllPost = async(payload:{search : string | undefined , 
    tags: string[] | [] , isFeatured : boolean | undefined ,
    
    page:number,limit:number,skip:number ,sortBy:string | undefined , sortOrder:string | undefined } )=>{
   
    console.log("All post are here")
    
   
    const andCondition :  PostWhereInput[] = [];
    
    if(payload.search){
        andCondition.push( {
               OR:[
                {
            title:{
            contains: payload.search as string,
            mode:'insensitive'
        }
         }, 
       {
         content:{
            contains: payload.search as string,
            mode:'insensitive'
        }
       },
       {
        tags:{
            has:payload.search as string
            
        }
       }
    ],
       })
    }

    if(payload.tags.length > 0 ){
        andCondition.push({
        tags:{
        hasEvery : payload.tags as string[]
     }
     })
    }

    if(typeof payload.isFeatured === 'boolean'){
        andCondition.push({
            isFeatured : payload.isFeatured
        })
    }

    const allPost = await prisma.post.findMany({
        take:payload.limit ,
        skip:payload.skip,
         where:{

         AND : andCondition
       
        },
        orderBy: payload.sortBy && payload.sortOrder ? {
           [payload.sortBy] : payload.sortOrder
        } : {createdAt:"desc"}
    });
    return allPost;
}

 export const postService = {
        createPost,
        getAllPost
    }