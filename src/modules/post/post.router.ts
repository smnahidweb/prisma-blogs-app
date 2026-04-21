import express, { NextFunction, Request, Response } from "express"
import { postController } from "./post.controller";
import {auth as betterAuth} from "../../lib/auth"
import auth, { UserRole } from "../../Middleare/auth";
const router = express.Router();


//getpostsbyauthorId

router.get('/posts-by-author',
   auth(UserRole.USER,UserRole.ADMIN),
    postController.getPostByAuthor
)



router.post('/', auth(UserRole.USER),

    postController.postCreate
)

router.get('/',postController.getAllPost)

router.get('/:id',
    postController.getPostById
)

router.put('/:id',
    auth(UserRole.USER,UserRole.ADMIN),
    postController.updateOwnPost
    )

    // delete post by author and admin

    router.delete('/:id',
    auth(UserRole.USER,UserRole.ADMIN),
    postController.deletePost
    )


export const postRouter = router;