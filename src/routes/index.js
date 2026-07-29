import { Router } from "express";

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

export { router as apiRouter };
