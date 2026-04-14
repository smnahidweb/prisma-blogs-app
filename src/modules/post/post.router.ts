import express, { NextFunction, Request, Response } from "express"
import { postController } from "./post.controller";
import {auth as betterAuth} from "../../lib/auth"
import auth, { UserRole } from "../../Middleare/auth";
const router = express.Router();



router.post('/', auth(UserRole.USER),

    postController.postCreate
)

router.get('/',postController.getAllPost)


export const postRouter = router;