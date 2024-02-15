import { tryCatchHandler } from "../helper/tryCatchHandler";
import category from "../model/categoryModel";

const categoryController = {
  createCategory: tryCatchHandler(async (req, res) => {
    const newCategory = await category.create({
      name: req.body.name,
    });
    res.status(201).json({
      status: "success",
      message: "Category created successfully",
      data: {
        category: newCategory,
      },
    });
  }),
  getCategories: tryCatchHandler(async (req, res) => {
    const categories = await category.find({
      isDeleted: false,
    });
    return res.status(200).json({
      status: "success",
      results: categories.length,
      data: {
        category: categories,
      },
    });
  }),
  getCategoryById: tryCatchHandler(async (req, res) => {
    const category = await category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    return res.status(200).json({
      status: "success",
      data: {
        category,
      },
    });
  }),
  updateCategory: tryCatchHandler(async (req, res) => {
    let updatedCategory = await category.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      {
        new: true,
      }
    );
    return res.status(200).json({
      status: "success",
      message: "Category updated successfully",
      data: {
        category: updatedCategory,
      },
    });
  }),
  deleteCategory: tryCatchHandler(async (req, res) => {
    const cat = await category.findByIdAndDelete(req.params.id);
    if (!cat) {
      return res.status(404).json({ error: "Category not found" });
    }
    return res.status(200).json({
      status: "success",
      message: "Category deleted successfully",
    });
  }),
};

export default categoryController;
