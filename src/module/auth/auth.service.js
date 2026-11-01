import { User } from "./user.model.js";
import { ApiError } from "./../../utils/api-error.js";
import { confirmPassword, hashPassword } from "../../utils/password.js";
import {
  generateAccessToken,
  generateRequestResetPassword,
  hashResetToken,
} from "../../utils/token.js";
import { createResetEmail } from "../../services/mail.service.js";

export const registerAccount = async ({
  firstName,
  lastName,
  email,
  password,
}) => {
  const existingUser = await User.exists({
    email,
  });

  if (existingUser) {
    throw new ApiError(409, "A user with this account already exist");
  }

  const passwordHash = await hashPassword(password);

  try {
    const user = await User.create({
      firstName,
      lastName,
      email,
      passwordHash,
    });

    return user.toJSON();
  } catch (err) {
    if (err?.code === 11000 && err?.keyPattern?.email) {
      throw new ApiError(409, "A user with this account already exist");
    }
    throw error;
  }
};

export const loginAccount = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+passwordHash");

  const isPasswordMatch = user ? await confirmPassword(password, user.passwordHash) : false;

  if (!user || !isPasswordMatch) {
    throw  new ApiError(400, "Username or password incorrect");
  }

  const accessToken = await generateAccessToken(user.id);

  return {
    accessToken,
    user: user.toJSON(),
  };
};

export const requestResetAccountPassword = async ({ email }) => {
  const user = await User.findOne({ email });

  if (!user) {
    return "If this email is registered, a mail containing the reset details has been sent";
  }

  const { resetToken, resetTokenHash, resetExpiresAt } =
    generateRequestResetPassword();

  await User.updateOne(
    { email: user.email },
    {
      $set: {
        passwordResetTokenHash: resetTokenHash,
        PasswordResetLinkExpiresAt: resetExpiresAt,
      },
    },
    {
      runValidators: true,
    },
  );

  try {
    await createResetEmail(user.email, user.firstName, resetToken);
  } catch (_error) {
    await User.updateOne(
      { email: user.email, passwordResetTokenHash: resetTokenHash },
      {
        $unset: {
          passwordResetTokenHash: "",
          PasswordResetLinkExpiresAt: "",
        },
      },
    );

    throw new ApiError(500, "Error sending reset email");
  }
};


export const resetAccountPassword = async({token, password}) => {

    const tokenHash = hashResetToken(token);
    const passwordHash = hashPassword(password);

    const user = User.findOneAndUpdate(
        {
            passwordResetTokenHash: passwordHash,
            PasswordResetLinkExpiresAt: {
                $gt: new Date()
            }
        },
        {
            $set: {
                passwordHash,
                passwordChangedAt: new Date()
            },
            $unset: {
                passwordResetTokenHash: '',
                PasswordResetLinkExpiresAt: ''
            }
        },
        {
            new: true,
            runValidators: true
        }
    )

    if(!user){
        throw new ApiError(400, "Invalid password or reset link has expired")
    }
}