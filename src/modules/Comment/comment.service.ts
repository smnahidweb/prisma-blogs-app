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
         }
        })

    }

   const result = await prisma.comment.create({
     data:payload,
   })

   return result;
    
}

export const commentService ={
    createComment

}