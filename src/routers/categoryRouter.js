import express from "express";
const router = express.Router();
import slugify from "slugify";
import {createNewCategory, deleteCategory, readCategories, updateCategory} from "../models/category/CategoryModel.js"

//create  category
router.post("/", async (req, res, next) => {
  try {
    const { name } = req.body;
    if (name.length && typeof name === "string") {
      const obj = {
        name,
        slug: slugify(name, {
          lower: true,
          trim: true,
        }),
      };

      const result = await createNewCategory(obj);

      if (result?._id) {
        return res.json({
          status: "success",
          message: "New category has been created",
          result,
        });
      }
    }

    res.json({
      status: "error",
      message: "Unable to create the category. Please try again later.",
    });
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error collection")) {
      error.errorCode = 200;
      error.message =
        "This category has been created, change the name and try again later";
    }
    next(error);
  }
});

//read the category
router.get("/", async (req, res, next) => {
  try {
    const categories = await readCategories();

    res.json({
      status: "success",
      message: "Here is the category lists ",
      categories,
    });
  } catch (error) {
    next(error);
  }
});

//update the category
router.put("/", async (req, res, next) => {
  try {
    const result = await updateCategory(req.body);

    if (result?._id) {
      return res.json({
        status: "success",
        message: "The category has been updated!",
        result,
      });
    }
  } catch (error) {
    next(error);
  }
});

//delete category
router.delete("/:_id", async (req, res, next) => {
  const { _id } = req.params;
  const result = await deleteCategory(_id);

  if (result?._id) {
    return res.json({
      status: "success",
      message: "The category has been deleted successfully",
    });
  }

  try {
    res.json({
      status: "error",
      message: "Unable to delete the category, try again later",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
