import mongoose from "mongoose";
import User from "../models/user.js";
import Semester from "../models/Semester.js";
import Module from "../models/Module.js";
import Assessment from "../models/Assessment.js";
import AcademicResource from "../models/AcademicResource.js";
import Skill from "../models/Skill.js";
import CareerProject from "../models/CareerProject.js";
import InternshipApplication from "../models/InternshipApplication.js";
import PlannerTask from "../models/PlannerTask.js";
import WeeklyInsight from "../models/WeeklyInsight.js";
import Portfolio from "../models/Portfolio.js";
import Achievement from "../models/Achievement.js";
import Notification from "../models/Notification.js";

const ownerId = (req) => req.session?.user?.id;

export const createCrudHandlers = (Model) => ({
  list: async (req, res, next) => {
    try {
      const query = { ...req.query, owner: ownerId(req) };
      delete query.page;
      delete query.limit;
      const records = await Model.find(query).sort({ createdAt: -1 });
      res.json(records);
    } catch (error) { next(error); }
  },
  get: async (req, res, next) => {
    try {
      const record = await Model.findOne({ _id: req.params.id, owner: ownerId(req) });
      if (!record) return res.status(404).json({ message: "Record not found." });
      res.json(record);
    } catch (error) { next(error); }
  },
  create: async (req, res, next) => {
    try {
      const record = await Model.create({ ...req.body, owner: ownerId(req) });
      res.status(201).json(record);
    } catch (error) { next(error); }
  },
  update: async (req, res, next) => {
    try {
      const record = await Model.findOneAndUpdate(
        { _id: req.params.id, owner: ownerId(req) },
        req.body,
        { new: true, runValidators: true }
      );
      if (!record) return res.status(404).json({ message: "Record not found." });
      res.json(record);
    } catch (error) { next(error); }
  },
  remove: async (req, res, next) => {
    try {
      const record = await Model.findOneAndDelete({ _id: req.params.id, owner: ownerId(req) });
      if (!record) return res.status(404).json({ message: "Record not found." });
      res.json({ message: "Record deleted." });
    } catch (error) { next(error); }
  },
});

export const semesters = createCrudHandlers(Semester);
export const modules = createCrudHandlers(Module);
export const assessments = createCrudHandlers(Assessment);
export const academicResources = createCrudHandlers(AcademicResource);
export const skills = createCrudHandlers(Skill);
export const careerProjects = createCrudHandlers(CareerProject);
export const internships = createCrudHandlers(InternshipApplication);
export const plannerTasks = createCrudHandlers(PlannerTask);
export const achievements = createCrudHandlers(Achievement);
export const notifications = createCrudHandlers(Notification);

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(ownerId(req)).select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(user);
  } catch (error) { next(error); }
};

export const updateProfile = async (req, res, next) => {
  try {
    const allowed = {};
    for (const field of ["fullName", "academic", "career", "skills", "planning", "profile"]) {
      if (req.body[field] !== undefined) allowed[field] = req.body[field];
    }
    const user = await User.findByIdAndUpdate(ownerId(req), allowed, { new: true, runValidators: true }).select("-password");
    res.json(user);
  } catch (error) { next(error); }
};

export const getPortfolio = async (req, res, next) => {
  try {
    let portfolio = await Portfolio.findOne({ owner: ownerId(req) });
    if (!portfolio) portfolio = await Portfolio.create({ owner: ownerId(req) });
    res.json(portfolio);
  } catch (error) { next(error); }
};

export const updatePortfolio = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOneAndUpdate(
      { owner: ownerId(req) },
      req.body,
      { new: true, upsert: true, runValidators: true }
    );
    res.json(portfolio);
  } catch (error) { next(error); }
};

export const getWeeklyInsights = async (req, res, next) => {
  try {
    const records = await WeeklyInsight.find({ owner: ownerId(req) }).sort({ weekStart: -1 });
    res.json(records);
  } catch (error) { next(error); }
};

export const saveWeeklyInsight = async (req, res, next) => {
  try {
    if (!req.body.weekStart) return res.status(400).json({ message: "weekStart is required." });
    const record = await WeeklyInsight.findOneAndUpdate(
      { owner: ownerId(req), weekStart: new Date(req.body.weekStart) },
      { ...req.body, owner: ownerId(req) },
      { new: true, upsert: true, runValidators: true }
    );
    res.status(200).json(record);
  } catch (error) { next(error); }
};

export const getDashboard = async (req, res, next) => {
  try {
    const owner = ownerId(req);
    const [user, semesterCount, modules, assessments, skills, projects, tasks, internshipCount, achievementCount] = await Promise.all([
      User.findById(owner).select("-password"),
      Semester.countDocuments({ owner }),
      Module.find({ owner }),
      Assessment.find({ owner }).sort({ dueDate: 1 }).limit(10),
      Skill.find({ owner }),
      CareerProject.find({ owner }),
      PlannerTask.find({ owner, status: { $ne: "Completed" } }).sort({ dueDate: 1 }).limit(12),
      InternshipApplication.countDocuments({ owner }),
      Achievement.countDocuments({ owner }),
    ]);

    const completedModules = modules.filter((item) => item.status === "Completed").length;
    const completedSkills = skills.filter((item) => item.status === "Completed").length;
    const completedProjects = projects.filter((item) => item.status === "Completed").length;

    res.json({
      user,
      summary: {
        semesters: semesterCount,
        modules: modules.length,
        completedModules,
        assessments: assessments.length,
        skills: skills.length,
        completedSkills,
        projects: projects.length,
        completedProjects,
        internships: internshipCount,
        achievements: achievementCount,
      },
      upcomingTasks: tasks,
      upcomingAssessments: assessments,
    });
  } catch (error) { next(error); }
};

export { Semester, Module, Assessment, AcademicResource, Skill, CareerProject, InternshipApplication, PlannerTask, WeeklyInsight, Portfolio, Achievement, Notification };
