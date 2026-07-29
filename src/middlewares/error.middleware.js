import { env } from './../config/env.js';

export const errorHandler = (error, _req, res, _next) => {
    const statusCode = error.statusCode ?? 500;
    
    const isProduction = env.NODE_ENV === "production"
   
    const message = (isProduction && statusCode === 500) 
        ? "An unexpected server error occured"
        : error.message || "An unexpected error occured"


    const responseBody = {
        success: false,
        message
    }

    if(error.details){
        responseBody.details = error.details
    }

    if (!isProduction) {
        responseBody.stack = error.stack;
      }
    

    res.status(statusCode).json(responseBody)
}