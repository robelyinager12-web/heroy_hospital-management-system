import { Router } from "express";
import { recruitmentController } from "./recruitment.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/rbac.middleware";

const router = Router();

const hrRoles = ["SUPER_ADMIN", "HOSPITAL_ADMIN", "HR_MANAGER"];

router.use(authenticate);

router.get("/jobs", requireRole(...hrRoles), recruitmentController.listJobs);
router.post("/jobs", requireRole(...hrRoles), recruitmentController.createJob);
router.put("/jobs/:id", requireRole(...hrRoles), recruitmentController.updateJob);
router.delete("/jobs/:id", requireRole(...hrRoles), recruitmentController.removeJob);

router.get("/applications", requireRole(...hrRoles), recruitmentController.listApplications);
router.post("/applications", requireRole(...hrRoles), recruitmentController.createApplication);
router.put("/applications/:id", requireRole(...hrRoles), recruitmentController.updateApplication);
router.delete("/applications/:id", requireRole(...hrRoles), recruitmentController.removeApplication);

export default router;
