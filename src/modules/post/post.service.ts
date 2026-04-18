import { AnyMxRecord } from "node:dns";
import { Post } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { skip } from "node:test";
import { SortOrder } from "../../../generated/prisma/internal/prismaNamespace";
import { date } from "better-auth";

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
    
    page:number,limit:number,skip:number ,sortBy:string , sortOrder:string  } )=>{
   
    console.log("All post are here")
    
    const {page,limit,skip} = payload
   
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
     
        orderBy: {
            [payload.sortBy] : payload.sortOrder
        },


    });

    const total = await prisma.post.count({
        where:{

         AND : andCondition
       
        }
    })

    

    
    return {
        data:allPost,
        pagination : {
        total,
         page,
        limit,
        skip,
        totalPage : Math.ceil(total/limit)
        }
    };
}

const getPostById = async(id:string)=>{
    console.log("Get Post by Id from service",id)


    const result = await prisma.$transaction(async(tx)=>{
        await tx.post.update({
        
        where:{
            id,
        },
        data:{
            views : {
                increment : 1
            }
        }

    })

    const post = await tx.post.findUnique({
        where:{
            id
        }
    })

    return post;
    })

    return result;
    
}

 export const postService = {
        createPost,
        getAllPost,
        getPostById
    }