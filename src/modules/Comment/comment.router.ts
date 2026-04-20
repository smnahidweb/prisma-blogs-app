
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


 export const commentRouter  = router;