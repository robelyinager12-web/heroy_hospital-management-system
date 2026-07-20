import { Router } from "express";
import { ipdController } from "./ipd.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/rbac.middleware";

const router = Router();

const staffRoles = ["SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "NURSE"];

router.use(authenticate);

router.get("/wards", requireRole(...staffRoles), ipdController.listWards);
router.post("/wards", requireRole("SUPER_ADMIN", "HOSPITAL_ADMIN"), ipdController.createWard);

router.get("/beds", requireRole(...staffRoles), ipdController.listBeds);
router.post("/beds", requireRole("SUPER_ADMIN", "HOSPITAL_ADMIN"), ipdController.createBed);

router.get("/", requireRole(...staffRoles), ipdController.list);
router.post("/", requireRole(...staffRoles), ipdController.admit);
router.post("/:id/discharge", requireRole(...staffRoles), ipdController.discharge);
router.delete("/:id", requireRole("SUPER_ADMIN", "HOSPITAL_ADMIN"), ipdController.remove);

export default router;
