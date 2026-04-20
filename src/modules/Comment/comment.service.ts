import { Status } from "../../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"


const createComment =  async(payload : {
    content: string,
    postId: string,
    authorId: string,
    parentsId?: string | null,
}) => {

  
    await prisma.post.findUniqueOrThrow({
        where:{
            id : payload.postId
        }
    }) 

    if(payload.parentsId){

        await prisma.comment.findUniqueOrThrow({
         where : {
            id : payload.parentsId
         },
         include:{
            post : true 
         }
        })

    }

   const result = await prisma.comment.create({
     data:payload,
   })

   return result;
    
}

// getCommentByID:

const getCommentByID = async (payload: { id: string }) => {
  
    const result = await prisma.comment.findUnique({
        where:{
            id : payload.id
        },
        include:{
            post : {
                select:{
                    id:true,
                    title:true,
                    content:true,
                    
                }
            }
        }
       
    })

    return result

};

//getCommentsByAuthorID:

const getCommentsByAuthorId = async (authorId:string)=>{
    console.log("AUthorId: ",authorId)

    const result = await prisma.comment.findMany({
        where:{
            authorId
        },
        orderBy:{
            createdAt:"desc"
        },
        include:{
            post:{
                select:{
                    id:true,
                    title:true,
                    content:true
                }
            }
        }
    })

    return result;

}

// deleteComment
const deleteComment = async (id:string, authorId:string)=>{

console.log("Deleting comment with ID:", id, "by author:", authorId)


const commentData = await prisma.comment.findUnique({
    where:{
        id,
        authorId
    },
   
            select:{
                id:true
            }
    
})

if(!commentData){
    throw new Error("Comment not found or you do not have permission to delete this comment.")

}

return  await prisma.comment.delete({
    where:{
        id:commentData.id
    }
})

}

// updateComment
const updateComment = async(id:string,data:{content?:string,status?:Status},authorId:string)=>{

console.log("Updating comment with ID:", id, "by author:", authorId)
console.log("updated Data",data)

const CommentData = await prisma.comment.findUnique({
    where:{
        id,
        authorId
    },
    select:{
        id:true
    }
})

if(!CommentData){ 
    throw new Error("Comment not found or you do not have permission to update this comment.")

}

return await prisma.comment.update({
    where:{
        id:CommentData.id
    },
    data 
    
})
 

}


export const commentService ={
    createComment,
    getCommentByID,
    getCommentsByAuthorId,
    deleteComment,updateComment

}