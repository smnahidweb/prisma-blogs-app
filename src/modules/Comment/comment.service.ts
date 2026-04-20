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

export const commentService ={
    createComment,
    getCommentByID,
    getCommentsByAuthorId

}