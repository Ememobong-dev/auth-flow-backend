import { ApiError } from "../utils/api-error.js"


export const notFoundHandler = (req, _res, next) => {
    next( new ApiError(404, `This route ${req.method} ${req.originalUrl} is not found `))
}