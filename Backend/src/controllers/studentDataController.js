import mongoose from "mongoose";
import {
  User,
  Semester,
  Module,
  Assessment,
  AcademicTask,
  AcademicResource,
  CareerProfile,
  Skill,
  CareerProject,
  InternshipApplication,
  PlannerTask,
  PLANNER_LINKED_MODELS,
  WeeklyInsight,
  Portfolio,
  Achievement,
  Notification,
  NOTIFICATION_RELATED_MODELS,
  FileAsset,
  FILE_ASSET_RELATED_MODELS,
} from "../models/index.js";

const MODEL_REGISTRY = {
  User,
  Semester,
  Module,
  Assessment,
  AcademicTask,
  AcademicResource,
  CareerProfile,
  Skill,
  CareerProject,
  InternshipApplication,
  PlannerTask,
  WeeklyInsight,
  Portfolio,
  Achievement,
  Notification,
  FileAsset,
};

const ownerId = (req) => req.session?.user?.id;

const createHttpError = (status, message) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

export const assertValidObjectId = (id, label = "ID") => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createHttpError(400, `Invalid ${label}.`);
  }
};

const sanitizePayload = (body) => {
  const clean = { ...(body && typeof body === "object" ? body : {}) };
  delete clean.owner;
  delete clean.userId;
  delete clean._id;
  delete clean.createdAt;
  delete clean.updatedAt;
  return clean;
};

const sanitizeFilterQuery = (rawQuery) => {
  const query = {};
  for (const [key, value] of Object.entries(rawQuery || {})) {
    if (
      key === "page" ||
      key === "limit" ||
      key === "owner" ||
      key === "userId" ||
      key.startsWith("$")
    ) {
      continue;
    }
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      query[key] = value;
    }
  }
  return query;
};

const assertOwnedRef = async (Model, id, owner, label) => {
  if (id === undefined || id === null || id === "") return;
  assertValidObjectId(id, label);
  if (Model === User) {
    if (String(id) !== String(owner)) {
      throw createHttpError(403, `Access denied for referenced ${label}.`);
    }
    return;
  }
  const exists = await Model.exists({ _id: id, owner });
  if (!exists) {
    throw createHttpError(404, `Referenced ${label} not found or access denied.`);
  }
};

const assertOwnedRefArray = async (Model, ids, owner, label) => {
  if (ids === undefined) return;
  if (!Array.isArray(ids)) {
    throw createHttpError(400, `${label} must be an array of IDs.`);
  }
  const uniqueIds = [...new Set(ids.map((id) => String(id)))];
  for (const id of uniqueIds) {
    assertValidObjectId(id, label);
  }
  if (uniqueIds.length === 0) return;
  const count = await Model.countDocuments({ _id: { $in: uniqueIds }, owner });
  if (count !== uniqueIds.length) {
    throw createHttpError(404, `One or more referenced ${label} records were not found or access denied.`);
  }
};

const assertPolymorphicRef = async (entity, allowedModels, owner, fieldName) => {
  if (entity === undefined || entity === null) return;
  const { kind, id } = entity;
  if (!kind && !id) return;
  if (!kind || !id) {
    throw createHttpError(400, `Both ${fieldName}.kind and ${fieldName}.id are required.`);
  }
  if (!allowedModels.includes(kind)) {
    throw createHttpError(400, `Invalid ${fieldName}.kind: ${kind}.`);
  }
  await assertOwnedRef(MODEL_REGISTRY[kind], id, owner, kind);
};

export const validateOwnedReferences = async (modelName, owner, payload) => {
  switch (modelName) {
    case "Module":
      await assertOwnedRef(Semester, payload.semester ?? payload.semesterId, owner, "Semester");
      break;
    case "Assessment":
      await assertOwnedRef(Module, payload.module ?? payload.moduleId, owner, "Module");
      break;
    case "AcademicTask":
      await assertOwnedRef(Module, payload.module ?? payload.moduleId, owner, "Module");
      await assertOwnedRef(Assessment, payload.assessment ?? payload.assessmentId, owner, "Assessment");
      await assertOwnedRef(FileAsset, payload.submissionDetails?.attachmentAsset, owner, "FileAsset");
      break;
    case "AcademicResource":
      await assertOwnedRef(Module, payload.module ?? payload.moduleId, owner, "Module");
      await assertOwnedRef(FileAsset, payload.fileAsset, owner, "FileAsset");
      break;
    case "CareerProject":
      await assertOwnedRef(FileAsset, payload.thumbnailAsset, owner, "FileAsset");
      await assertOwnedRefArray(Skill, payload.skillIds, owner, "Skill");
      break;
    case "InternshipApplication":
      await assertOwnedRef(FileAsset, payload.resumeAsset, owner, "FileAsset");
      break;
    case "PlannerTask":
      await assertPolymorphicRef(payload.linkedEntity, PLANNER_LINKED_MODELS, owner, "linkedEntity");
      break;
    case "Portfolio":
      await assertOwnedRefArray(CareerProject, payload.projectIds, owner, "CareerProject");
      await assertOwnedRefArray(Achievement, payload.achievementIds, owner, "Achievement");
      await assertOwnedRefArray(Skill, payload.skillIds, owner, "Skill");
      await assertOwnedRef(FileAsset, payload.profilePhotoAsset, owner, "FileAsset");
      break;
    case "Achievement":
      await assertOwnedRef(FileAsset, payload.certificateAsset, owner, "FileAsset");
      break;
    case "Notification":
      await assertPolymorphicRef(payload.relatedEntity, NOTIFICATION_RELATED_MODELS, owner, "relatedEntity");
      break;
    case "FileAsset":
      if (payload.relatedModel !== undefined || payload.relatedId !== undefined) {
        if (!payload.relatedModel || !payload.relatedId) {
          throw createHttpError(400, "Both relatedModel and relatedId are required when linking a FileAsset.");
        }
        if (!FILE_ASSET_RELATED_MODELS.includes(payload.relatedModel)) {
          throw createHttpError(400, `Invalid relatedModel: ${payload.relatedModel}.`);
        }
        await assertOwnedRef(MODEL_REGISTRY[payload.relatedModel], payload.relatedId, owner, payload.relatedModel);
      }
      break;
    default:
      break;
  }
};

const validatePartialUpdateConstraints = (modelName, existing, payload) => {
  if (modelName === "Semester" || modelName === "CareerProject") {
    const start = payload.startDate !== undefined ? new Date(payload.startDate) : existing.startDate;
    const end = payload.endDate !== undefined ? new Date(payload.endDate) : existing.endDate;
    if (start && end && end < start) {
      throw createHttpError(400, "endDate must be on or after startDate.");
    }
  }
  if (modelName === "Assessment") {
    const maxMarks = payload.maxMarks !== undefined ? payload.maxMarks : existing.maxMarks;
    const score = payload.score !== undefined ? payload.score : existing.score;
    if (maxMarks != null && score != null && score > maxMarks) {
      throw createHttpError(400, "score cannot exceed maxMarks.");
    }
  }
};

export const createCrudHandlers = (Model) => ({
  list: async (req, res, next) => {
    try {
      const query = { ...sanitizeFilterQuery(req.query), owner: ownerId(req) };
      const records = await Model.find(query).sort({ createdAt: -1 });
      res.json(records);
    } catch (error) {
      next(error);
    }
  },
  get: async (req, res, next) => {
    try {
      assertValidObjectId(req.params.id, Model.modelName);
      const record = await Model.findOne({ _id: req.params.id, owner: ownerId(req) });
      if (!record) return res.status(404).json({ message: "Record not found." });
      res.json(record);
    } catch (error) {
      next(error);
    }
  },
  create: async (req, res, next) => {
    try {
      const owner = ownerId(req);
      const payload = sanitizePayload(req.body);
      await validateOwnedReferences(Model.modelName, owner, payload);
      const record = await Model.create({ ...payload, owner });
      res.status(201).json(record);
    } catch (error) {
      next(error);
    }
  },
  update: async (req, res, next) => {
    try {
      const owner = ownerId(req);
      assertValidObjectId(req.params.id, Model.modelName);
      const existing = await Model.findOne({ _id: req.params.id, owner });
      if (!existing) return res.status(404).json({ message: "Record not found." });

      const payload = sanitizePayload(req.body);
      await validateOwnedReferences(Model.modelName, owner, payload);
      validatePartialUpdateConstraints(Model.modelName, existing, payload);

      const record = await Model.findOneAndUpdate(
        { _id: req.params.id, owner },
        payload,
        { new: true, runValidators: true }
      );
      res.json(record);
    } catch (error) {
      next(error);
    }
  },
  remove: async (req, res, next) => {
    try {
      assertValidObjectId(req.params.id, Model.modelName);
      const record = await Model.findOneAndDelete({ _id: req.params.id, owner: ownerId(req) });
      if (!record) return res.status(404).json({ message: "Record not found." });
      res.json({ message: "Record deleted." });
    } catch (error) {
      next(error);
    }
  },
});

export const semesters = createCrudHandlers(Semester);
export const modules = createCrudHandlers(Module);
export const assessments = createCrudHandlers(Assessment);
export const academicTasks = createCrudHandlers(AcademicTask);
export const academicResources = createCrudHandlers(AcademicResource);
export const skills = createCrudHandlers(Skill);
export const careerProjects = createCrudHandlers(CareerProject);
export const internships = createCrudHandlers(InternshipApplication);
export const plannerTasks = createCrudHandlers(PlannerTask);
export const achievements = createCrudHandlers(Achievement);
export const notifications = createCrudHandlers(Notification);
export const fileAssets = createCrudHandlers(FileAsset);

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(ownerId(req)).select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const allowed = {};
    for (const field of ["fullName", "academic", "career", "skills", "planning", "profile"]) {
      if (req.body[field] !== undefined) allowed[field] = req.body[field];
    }
    const user = await User.findByIdAndUpdate(ownerId(req), allowed, {
      new: true,
      runValidators: true,
    }).select("-password");
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const getCareerProfile = async (req, res, next) => {
  try {
    const owner = ownerId(req);
    let profile = await CareerProfile.findOne({ owner });
    if (!profile) {
      profile = await CareerProfile.create({ owner });
    }
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

export const updateCareerProfile = async (req, res, next) => {
  try {
    const owner = ownerId(req);
    const payload = sanitizePayload(req.body);
    const profile = await CareerProfile.findOneAndUpdate(
      { owner },
      { ...payload, owner },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

export const getPortfolio = async (req, res, next) => {
  try {
    const owner = ownerId(req);
    let portfolio = await Portfolio.findOne({ owner }).populate([
      { path: "projectIds", match: { owner } },
      { path: "achievementIds", match: { owner } },
      { path: "skillIds", match: { owner } },
      { path: "profilePhotoAsset", match: { owner } },
    ]);
    if (!portfolio) {
      portfolio = await Portfolio.create({ owner });
    }
    res.json(portfolio);
  } catch (error) {
    next(error);
  }
};

export const updatePortfolio = async (req, res, next) => {
  try {
    const owner = ownerId(req);
    const payload = sanitizePayload(req.body);
    await validateOwnedReferences("Portfolio", owner, payload);
    const portfolio = await Portfolio.findOneAndUpdate(
      { owner },
      { ...payload, owner },
      { new: true, upsert: true, runValidators: true }
    ).populate([
      { path: "projectIds", match: { owner } },
      { path: "achievementIds", match: { owner } },
      { path: "skillIds", match: { owner } },
      { path: "profilePhotoAsset", match: { owner } },
    ]);
    res.json(portfolio);
  } catch (error) {
    next(error);
  }
};

export const getWeeklyInsights = async (req, res, next) => {
  try {
    const records = await WeeklyInsight.find({ owner: ownerId(req) }).sort({ weekStart: -1 });
    res.json(records);
  } catch (error) {
    next(error);
  }
};

export const saveWeeklyInsight = async (req, res, next) => {
  try {
    const owner = ownerId(req);
    if (!req.body.weekStart) {
      return res.status(400).json({ message: "weekStart is required." });
    }
    const payload = sanitizePayload(req.body);
    const weekStart = new Date(payload.weekStart);
    if (Number.isNaN(weekStart.getTime())) {
      return res.status(400).json({ message: "Invalid weekStart date." });
    }
    if (payload.weekEnd) {
      const weekEnd = new Date(payload.weekEnd);
      if (Number.isNaN(weekEnd.getTime()) || weekEnd < weekStart) {
        return res.status(400).json({ message: "weekEnd must be on or after weekStart." });
      }
    }

    const record = await WeeklyInsight.findOneAndUpdate(
      { owner, weekStart },
      { ...payload, owner, weekStart },
      { new: true, upsert: true, runValidators: true }
    );
    res.status(200).json(record);
  } catch (error) {
    next(error);
  }
};

export const getDashboard = async (req, res, next) => {
  try {
    const owner = ownerId(req);
    const [
      user,
      careerProfile,
      semesterCount,
      modulesList,
      assessmentsList,
      academicTaskCount,
      skillsList,
      projectsList,
      tasksList,
      internshipCount,
      achievementCount,
      unreadNotifications,
    ] = await Promise.all([
      User.findById(owner).select("-password"),
      CareerProfile.findOne({ owner }),
      Semester.countDocuments({ owner }),
      Module.find({ owner }),
      Assessment.find({ owner }).sort({ dueDate: 1 }).limit(10),
      AcademicTask.countDocuments({ owner }),
      Skill.find({ owner }),
      CareerProject.find({ owner }),
      PlannerTask.find({ owner, status: { $ne: "Completed" } }).sort({ dueDate: 1 }).limit(12),
      InternshipApplication.countDocuments({ owner }),
      Achievement.countDocuments({ owner }),
      Notification.countDocuments({ owner, read: false }),
    ]);

    const completedModules = modulesList.filter((item) => item.status === "Completed").length;
    const completedSkills = skillsList.filter((item) => item.status === "Completed").length;
    const completedProjects = projectsList.filter((item) => item.status === "Completed").length;

    res.json({
      user,
      careerProfile,
      summary: {
        semesters: semesterCount,
        modules: modulesList.length,
        completedModules,
        assessments: assessmentsList.length,
        academicTasks: academicTaskCount,
        skills: skillsList.length,
        completedSkills,
        projects: projectsList.length,
        completedProjects,
        internships: internshipCount,
        achievements: achievementCount,
        unreadNotifications,
      },
      upcomingTasks: tasksList,
      upcomingAssessments: assessmentsList,
    });
  } catch (error) {
    next(error);
  }
};

export {
  Semester,
  Module,
  Assessment,
  AcademicTask,
  AcademicResource,
  CareerProfile,
  Skill,
  CareerProject,
  InternshipApplication,
  PlannerTask,
  WeeklyInsight,
  Portfolio,
  Achievement,
  Notification,
  FileAsset,
};
