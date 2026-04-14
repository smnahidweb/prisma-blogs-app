import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

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

const getAllPost = async(payload:{search : string | undefined } )=>{
    console.log("All post are here")
    const allPost = await prisma.post.findMany({
         where:{
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
    ]
       
        }
    });
    return allPost;
}

 export const postService = {
        createPost,
        getAllPost
    }