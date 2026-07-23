import { Response, NextFunction } from "express";
import { cmsService } from "./cms.service";
import {
  createBlogPostSchema,
  updateBlogPostSchema,
  createPageSchema,
  updatePageSchema,
  listQuerySchema,
} from "./cms.validation";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";

export const cmsController = {
  async listPosts(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      res.json(await cmsService.listPosts(listQuerySchema.parse(req.query)));
    } catch (err) {
      next(err);
    }
  },

  async createPost(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = createBlogPostSchema.parse(req.body);
      const post = await cmsService.createPost(req.user!.id, input);
      res.status(201).json({ post });
    } catch (err) {
      next(err);
    }
  },

  async updatePost(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = updateBlogPostSchema.parse(req.body);
      const post = await cmsService.updatePost(req.params.id, input);
      res.json({ post });
    } catch (err) {
      next(err);
    }
  },

  async removePost(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await cmsService.removePost(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  async listPages(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      res.json(await cmsService.listPages(listQuerySchema.parse(req.query)));
    } catch (err) {
      next(err);
    }
  },

  async createPage(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = createPageSchema.parse(req.body);
      const page = await cmsService.createPage(input);
      res.status(201).json({ page });
    } catch (err) {
      next(err);
    }
  },

  async updatePage(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = updatePageSchema.parse(req.body);
      const page = await cmsService.updatePage(req.params.id, input);
      res.json({ page });
    } catch (err) {
      next(err);
    }
  },

  async removePage(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await cmsService.removePage(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
