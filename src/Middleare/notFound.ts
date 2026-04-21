import { date } from "better-auth";
import { Request, Response } from "express";


 export function notFound(req:Request, res:Response) {

    res.status(404).json({
        error: "Not Found",
        message: "The requested resource was not found on this server.",
        path: req.originalUrl,
        date: new Date().toISOString()
    });

}
