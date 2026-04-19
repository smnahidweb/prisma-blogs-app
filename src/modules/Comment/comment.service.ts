

const createComment =  async(payload : {
    content: string,
    postId: string,
    authorId: string,
    parentsId?: string | null,
    status ? : string



}) => {

    console.log("This is a comment services",payload);
    
}


export const commentService ={
    createComment

}