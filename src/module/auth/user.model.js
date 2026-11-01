import mongoose from "mongoose";

const removePrivateField = ( _document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();

    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
    delete returnedObject.passwordResetTokenHash;
    delete returnedObject.PasswordResetLinkExpiresAt;
    delete returnedObject.passwordChangedAt;

    return returnedObject;


}

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "First name is required"],
            trim: true,
            minLength: [1, "First name cannot be empty"],
            maxLength: [50, "First name cannot exceed 50 characters"],
        },
        lastName: {
            type: String,
            required: [true, "Last name is required"],
            trim: true,
            minLength: [1, "Last name cannot be empty"],
            maxLength: [50, "Last name cannot exceed 50 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
            minLength: [1, "Email cannot be empty"],
            maxLength: [254, "Email cannot exceed 254 characters"],
            match:[  /^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"]
        },
        passwordHash: {
            type: String,
            required: [true, "Password is required"],
            select: false,
        },
        passwordResetTokenHash: {
            type: String,
            default: undefined,
            select: false,
        },
        PasswordResetLinkExpiresAt: {
            type: Date,
            default: undefined,
            select: false,

        },
        passwordChangedAt: {
            type: Date,
            default: undefined,
            select: false,
        },

    }, 
    {
        collection: "users",
        timestamps: true,
        toJSON: {
            transform: removePrivateField 

        },
        toObject: {
            transform: removePrivateField 
        }
    }
)


userSchema.index(
    {
        email: 1
    },
    {
        unique: true,
        name: "ux_email"
    }
)

userSchema.index(
    {
        passwordResetTokenHash: 1
    },
    {
        unique: true,
        sparse: true,
        name: "ux_reset_token"
    }
)


export const User = mongoose.model("User", userSchema)

