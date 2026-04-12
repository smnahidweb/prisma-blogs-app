import express, { NextFunction, Request, Response } from "express"
import { postController } from "./post.controller";
import {auth as betterAuth} from "../../lib/auth"
const router = express.Router();

export enum UserRole {
    USER = "USER",
    ADMIN = "ADMIN" 
}

declare global {
   namespace Express {
    interface Request {
        user?:{
            id:string;
            email:string;
            name:string;
            role: string;
            emailVerified:boolean

        }
    }
   }
}

const auth = (...roles:any)=>{
    return async(req:Request,res:Response,next:NextFunction)=>{
      const session = await betterAuth.api.getSession({
        headers: req.headers as any,
      })
    

      if(!session){
        return res.status(401).json({
            success:false,
            message:"You are not authorized"
        })
      }
    
     if(!session.user.emailVerified){
        return res.status(403).json({
            success:false,
            message:"Your email isnt verified . Please verified the email first"
        })
      }

      req.user = {
         id:session.user.id,
         email: session.user.email,
         name: session.user.name,
         role: session.user.role as string,
         emailVerified:session.user.emailVerified,

      }
    
    
    
    
    
      console.log(session)
       next();
    }
}


router.post('/', auth("USER"),

    postController.postCreate
)


export const postRouter = router;