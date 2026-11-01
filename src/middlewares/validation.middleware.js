
import { ApiError } from './../utils/api-error.js';


export const validate = (schema) => {
    return async function validateRequest (req, res, next) {
        const validatedData = await schema.safeParseAsync({
            body: req.body,
            params: req.params,
            query: req.query
        })

        if(!validatedData.success){
            const details = validatedData.error.issues
                .map( (issue) => {
                   const [source, ...fieldPath] = issue.path

                    return {
                        source: typeof source === "string" ? source : "request",
                        field: fieldPath.length > 0 ? fieldPath.join(".") : null,
                        message: issue.message,
                        code: issue.code,
                    }
                })
            return next(
                new 
               ApiError(400, "An Error occured while validating request", details)
            )
        }

        req.validated = validatedData.data
        return next()
    }
}