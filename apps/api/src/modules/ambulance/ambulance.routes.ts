import { Router } from "express";
import { ambulanceController } from "./ambulance.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/rbac.middleware";

const router = Router();

const staffRoles = ["SUPER_ADMIN", "HOSPITAL_ADMIN", "AMBULANCE_DRIVER", "RECEPTIONIST"];

router.use(authenticate);

router.get("/vehicles", requireRole(...staffRoles), ambulanceController.listAmbulances);
router.post("/vehicles", requireRole("SUPER_ADMIN", "HOSPITAL_ADMIN"), ambulanceController.createAmbulance);

router.get("/", requireRole(...staffRoles), ambulanceController.list);
router.post("/", requireRole(...staffRoles), ambulanceController.createRequest);
router.put("/:id", requireRole(...staffRoles), ambulanceController.updateRequest);
router.delete("/:id", requireRole("SUPER_ADMIN", "HOSPITAL_ADMIN"), ambulanceController.remove);

export default router;
