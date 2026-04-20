
import express, { Router } from 'express';
import { commentController } from './comment.controller';

import auth, { UserRole } from '../../Middleare/auth';



const router : Router = express.Router();

router.post('/',

    auth(UserRole.USER, UserRole.ADMIN),
    
    
    commentController.createComment)

    // getCommentById
    router.get('/:id',
        commentController.getCommentById
    )

    // getCommentsByAuthorId
    router.get("/author/:authorId",
        commentController.getCommentsByAUthorId
    )

    // deleteComment
    router.delete('/:id',
        auth(UserRole.USER, UserRole.ADMIN),
        commentController.deleteComment
    )

    // updateComment
    router.patch('/:id',
        auth(UserRole.USER, UserRole.ADMIN),
        commentController.updateComment
    )

 export const commentRouter  = router;