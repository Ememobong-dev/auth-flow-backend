import { rateLimit } from 'express-rate-limit'


const rateLimitHandler = (message) =>  (req, res, next, options) => 
        res.status(options.statusCode)
        .json(
            {
                success: false,
                message,
                data: null
            }
        ),



export const registerLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 5, // Limit each IP to 5 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8',
	legacyHeaders: false,
	ipv6Subnet: 56, 
    handler: rateLimitHandler("Many attempts at creating an account. Try again later")
})

export const loginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 10, // Limit each IP to 10 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8',
	legacyHeaders: false,
	ipv6Subnet: 56, 
    handler: rateLimitHandler("Many attempts in loggin into account. Try again later")
})

export const loginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 5, // Limit each IP to 5 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8',
	legacyHeaders: false,
	ipv6Subnet: 56, 
    handler: rateLimitHandler("Many attempts in loggin into account. Try again later")
})


export const resetPasswordRequestLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 5, // Limit each IP to 5 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8',
	legacyHeaders: false,
	ipv6Subnet: 56, 
    handler: rateLimitHandler("Many attempts in requesting reset password. Try again later")
})

export const resetPasswordLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 5, // Limit each IP to 5 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8',
	legacyHeaders: false,
	ipv6Subnet: 56, 
    handler: rateLimitHandler("Many attempts in resetting password. Try again later")
})