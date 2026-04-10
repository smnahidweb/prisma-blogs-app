import express from "express"
import { postController } from "./post.controller";

const router = express.Router();


router.post('/',

    postController.postCreate
)


export const postRouter = router;