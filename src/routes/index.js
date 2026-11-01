import { Router } from "express";
import { authRouter } from "../module/auth/auth.routes.js";

const router = Router();



router.get("/health", (_req, res) => {
  return res.status(200).json({
    success: true,
    message: "This health route from our backend is working",
    data: {
      upTime: process.uptime(),
      timeStamp: new Date().toISOString(),
    },
  });
});

router.use("/auth", authRouter);

export { router as apiRouter };
