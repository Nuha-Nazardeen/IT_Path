import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  semesters, modules, assessments, academicResources, skills, careerProjects,
  internships, plannerTasks, achievements, notifications, getProfile, updateProfile,
  getPortfolio, updatePortfolio, getWeeklyInsights, saveWeeklyInsight, getDashboard,
} from "../controllers/studentDataController.js";

const router = express.Router();
router.use(requireAuth);

const registerCrud = (path, handlers) => {
  router.get(path, handlers.list);
  router.post(path, handlers.create);
  router.get(`${path}/:id`, handlers.get);
  router.put(`${path}/:id`, handlers.update);
  router.patch(`${path}/:id`, handlers.update);
  router.delete(`${path}/:id`, handlers.remove);
};

router.get("/dashboard", getDashboard);
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.patch("/profile", updateProfile);
router.get("/portfolio", getPortfolio);
router.put("/portfolio", updatePortfolio);
router.patch("/portfolio", updatePortfolio);
router.get("/insights", getWeeklyInsights);
router.post("/insights", saveWeeklyInsight);
router.put("/insights", saveWeeklyInsight);

registerCrud("/semesters", semesters);
registerCrud("/modules", modules);
registerCrud("/assessments", assessments);
registerCrud("/academic-resources", academicResources);
registerCrud("/skills", skills);
registerCrud("/projects", careerProjects);
registerCrud("/internships", internships);
registerCrud("/tasks", plannerTasks);
registerCrud("/achievements", achievements);
registerCrud("/notifications", notifications);

export default router;
