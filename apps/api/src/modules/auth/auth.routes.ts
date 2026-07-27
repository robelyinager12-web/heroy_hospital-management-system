import { Router } from "express";
import { authController } from "./auth.controller";
import { authRateLimiter } from "../../middlewares/rate-limit.middleware";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/register", authRateLimiter, authController.register);
router.post("/login", authRateLimiter, authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.get("/me", authenticate, authController.getProfile);
router.put("/me", authenticate, authController.updateProfile);
router.put("/me/password", authenticate, authController.changePassword);

export default router;
