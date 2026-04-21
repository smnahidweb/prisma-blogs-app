import { AnyMxRecord } from "node:dns";
import { Post, PostStatus, Status } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { skip } from "node:test";
import { SortOrder } from "../../../generated/prisma/internal/prismaNamespace";
import { date } from "better-auth";
import { isDataView } from "node:util/types";
import { auth } from "../../lib/auth";
import { totalmem } from "node:os";

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
        include:{
            _count:{
                select:{
                    comments:true
                }
            }
        }


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
        },
     include:{

            comments : {

                where:{

                    parentsId:null,

                    status:Status.APPROVED

                },
                orderBy:{
                    createdAt:"desc"
                },

                include:{

                    replies:{
                        where:{
                            status:Status.APPROVED
                        },
                        orderBy:{
                            createdAt:"asc"
                        },
                        include:{
                            replies:{
                                where:{
                                    status:Status.APPROVED
                                },
                                 orderBy:{
                            createdAt:"asc"
                        },
                                include:{
                                    replies:{
                                        where:{
                                            status:Status.APPROVED
                                        },
                                         orderBy:{
                            createdAt:"asc"
                        },
                                    }
                                }
                            }
                        }
                    }
                   
                }

            },
            _count:{
                select:{
                    comments:true
                }
            }

        }
    })

    return post;
    })

    return result;
    
}

//getpostsbyauthorId
const getPostByAuthorId = async (authorId:string)=>{

    console.log("Get Post by authorId from service",authorId)   



   await prisma.user.findUniqueOrThrow({
    where:{
        id:authorId,
        status:"ACTIVE" 
     },
     select:
     {
    id:true,
    
    }
   })

    const result = await prisma.post.findMany({
        where:{
            authorId
        },
        include:{
            _count:{
                select:{
                    comments:true
                }
            }
        }
    })


    // totalpost by author

   const totalPostByAuthor = await prisma.post.count({
    where:{
        authorId
    }
   })


    return{
        data:result,
        total:totalPostByAuthor
    }

}

//update ownd post by author

const updateOwnPost = async (id: string, updateData: any, authorId: string, isAdmin: boolean) => {
    console.log("Update own post service called", id, updateData, authorId, isAdmin);

    // ১. প্রথমে পোস্টটি খুঁজে বের করুন (অথর আইডি ছাড়াই)
    const post = await prisma.post.findUnique({
        where: { id }
    });

    if (!post) {
        throw new Error("Post not found");
    }

    // ২. পারমিশন চেক: যদি অ্যাডমিন না হয় এবং পোস্টটি তার নিজের না হয়
    if (!isAdmin && post.authorId !== authorId) {
        throw new Error("You are not authorized to update this post");
    }

    if(!isAdmin){
    delete updateData.isFeatured; 
}
   
    return await prisma.post.update({
        where: { id },
        data: updateData
    });
}

//delete own post by author and admin

const deletePost = async (id: string, authorId: string, isAdmin: boolean) => {
    
    const postData = await prisma.post.findFirst({
        where:{
            id
        }
    })

    if(!postData){
        throw new Error("Post not found");
    }

    if(!isAdmin && postData.authorId !== authorId){
        throw new Error("You are not authorized to delete this post");
    }

    return await prisma.post.delete({
        where:{
            id
        }
    })

}


//post stats

const postStats = async () => {
  return await prisma.$transaction(async (tx) => {

    const [totalPosts, publicPosts, draftPosts, archivedPosts,totalComments,approvedComments,totalUsers,adminCount,userCount,totalViews] = await Promise.all([
      tx.post.count(),
      tx.post.count({
        where: { status: PostStatus.PUBLISHED }
      }),
      tx.post.count({
        where: { status: PostStatus.DRAFT }
      }),
      tx.post.count({
        where: { status: PostStatus.ARCHIVED }
      }),
      tx.comment.count(),

      tx.comment.count({
        where :{
            status:Status.APPROVED
        }
      }),

      tx.user.count(),

      tx.user.count({
        where:{
            role:"ADMIN"
        }
      }),

      tx.user.count({
        where:{
            role:"USER"
        }
      }),

      tx.post.aggregate({
        _sum:{
            views:true
        }
      })


    ]);

    return {
      totalPosts,
      publicPosts,
      draftPosts,
      archivedPosts,
      totalComments,
      approvedComments,
      totalUsers,
      adminCount,
      userCount,
        totalViews: totalViews._sum.views || 0
    };
  });
};


 export const postService = {
        createPost,
        getAllPost,
        getPostById,
        getPostByAuthorId,
        updateOwnPost,
        deletePost,
        postStats
    }
