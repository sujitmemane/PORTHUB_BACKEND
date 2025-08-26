import { Request, Response } from "express";
import CategoryModel from "../models/category";
import SkillModel from "../models/skill";
import { errorResponse, successResponse } from "../utils/responses";

export const handleCreateCategory = async (req: Request, res: Response) => {
  try {
    const { _id } = req.user;
    const { name } = req.body;

    if (!name) {
      return errorResponse(res, 400, {}, "Category name is required");
    }

    const existing = await CategoryModel.findOne({ user: _id, name });
    if (existing) {
      return errorResponse(res, 409, {}, "Category already exists");
    }

    const category = await CategoryModel.create({ user: _id, name });

    return successResponse(res, 201, category, "Category created successfully");
  } catch (error: any) {
    return errorResponse(
      res,
      500,
      {},
      error?.message || "Failed to create category"
    );
  }
};

export const handleDeleteCategory = async (req: Request, res: Response) => {
  try {
    const { _id } = req.user;
    const { categoryId } = req.body;

    if (!categoryId) {
      return errorResponse(res, 400, {}, "Category ID is required");
    }

    const deletedCategory = await CategoryModel.findOneAndDelete({
      user: _id,
      _id: categoryId,
    });

    if (!deletedCategory) {
      return errorResponse(res, 404, {}, "Category not found");
    }

    await SkillModel.deleteMany({ category: categoryId });

    return successResponse(res, 200, {}, "Category deleted successfully");
  } catch (error: any) {
    return errorResponse(
      res,
      500,
      {},
      error?.message || "Failed to delete category"
    );
  }
};

export const handleAddSkill = async (req: Request, res: Response) => {
  try {
    const { categoryId, name } = req.body;

    if (!categoryId || !name) {
      return errorResponse(
        res,
        400,
        {},
        "Category ID and skill name are required"
      );
    }

    const category = await CategoryModel.findById(categoryId);
    if (!category) {
      return errorResponse(res, 404, {}, "Category not found");
    }

    const existing = await SkillModel.findOne({ category: categoryId, name });
    if (existing) {
      return errorResponse(
        res,
        409,
        {},
        "Skill already exists in this category"
      );
    }

    const skill = await SkillModel.create({ category: categoryId, name });

    return successResponse(res, 201, skill, "Skill added successfully");
  } catch (error: any) {
    return errorResponse(res, 500, {}, error?.message || "Failed to add skill");
  }
};

export const handleDeleteSkill = async (req: Request, res: Response) => {
  try {
    const { skillId } = req.body;

    if (!skillId) {
      return errorResponse(res, 400, {}, "Skill ID is required");
    }

    const deletedSkill = await SkillModel.findByIdAndDelete(skillId);

    if (!deletedSkill) {
      return errorResponse(res, 404, {}, "Skill not found");
    }

    return successResponse(res, 200, {}, "Skill deleted successfully");
  } catch (error: any) {
    return errorResponse(
      res,
      500,
      {},
      error?.message || "Failed to delete skill"
    );
  }
};

export const getUserSkill = async (req: Request, res: Response) => {
  try {
    const { _id } = req.user;

    const categories = await CategoryModel.find({ user: _id }).lean();

    const result = await Promise.all(
      categories.map(async (category) => {
        const skills = await SkillModel.find({ category: category._id }).lean();
        return { ...category, skills };
      })
    );

    return successResponse(
      res,
      200,
      result,
      "User skills fetched successfully"
    );
  } catch (error: any) {
    return errorResponse(
      res,
      500,
      {},
      error?.message || "Failed to fetch user skills"
    );
  }
};
