import {
  loginAccount,
  registerAccount,
  requestResetAccountPassword,
  resetAccountPassword,
} from "./auth.service.js";

export const registerController = async (request, response) => {
  const user = await registerAccount(request.validated.body);

  return response.status(201).json({
    success: true,
    message: "Account created successfully",
    data: { user },
  });
};

export const loginController = async (request, response) => {
  const result = await loginAccount(request.validated.body);

  return response.status(200).json({
    success: true,
    message: "User logged in successfully",
    data: result,
  });
};

export const requestResetPasswordController = async (request, response) => {
  const result = await requestResetAccountPassword(request.validated.body);

  return response.status(200).json({
    success: true,
    message: result.message,
    data: null,
  });
};

export const ResetPasswordController = async (request, response) => {
  const user = await resetAccountPassword({
    token: request.validated.params.token,
    password: request.validated.body,
  });

  return response.status(200).json({
    success: true,
    message: "Password Reset Successfully",
    data: null,
  });
};
