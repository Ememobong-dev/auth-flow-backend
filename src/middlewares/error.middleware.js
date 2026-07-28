import { env } from './../config/env';

export const error = (error, req, res, next) => {
    const statusCode = error.statusCode ?? 500;
    
    const isProduction = env.NODE_ENV === "production"
   
    const message = (isProduction && statusCode === 500) 
        ? "An unexpected server error occured"
        : error.message || "An unexpected error occured"


    const responseBody = {
        status: false,
        message
    }

    if(error.details){
        responseBody.details = error.details
    }

    res.status(statusCode).json(responseBody)
}