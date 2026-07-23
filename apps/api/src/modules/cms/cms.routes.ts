import { Router } from "express";
import { cmsController } from "./cms.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/rbac.middleware";

const router = Router();

const editorRoles = ["SUPER_ADMIN", "HOSPITAL_ADMIN"];

router.use(authenticate);

router.get("/posts", cmsController.listPosts);
router.post("/posts", requireRole(...editorRoles), cmsController.createPost);
router.put("/posts/:id", requireRole(...editorRoles), cmsController.updatePost);
router.delete("/posts/:id", requireRole(...editorRoles), cmsController.removePost);

router.get("/pages", cmsController.listPages);
router.post("/pages", requireRole(...editorRoles), cmsController.createPage);
router.put("/pages/:id", requireRole(...editorRoles), cmsController.updatePage);
router.delete("/pages/:id", requireRole(...editorRoles), cmsController.removePage);

export default router;
