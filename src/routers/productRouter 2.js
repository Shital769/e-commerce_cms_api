import express from "express";
import slugify from "slugify";
const router = express.Router();
import multer from "multer";
import fs from "fs";
import path from "path";
import {
  createProduct,
  deleteProducts,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../models/product/ProductModel.js";
import {
  editProductValidation,
  newProductValidation,
} from "../middlewares/joiMiddleware.js";

const __dirname = path.resolve();

const imgFolderPath = "public/img/prpducts";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let error = null;
    //validation error check
    cb(error, imgFolderPath);
  },
  filename: (req, file, cb) => {
    let error = null;
    const fullFileName = Date.now() + "_" + file.originalname;
    cb(error, fullFileName);
  },
});

const upload = multer({ storage });

router.get("/:_id?", async (req, res, next) => {
  try {
    const { _id } = req.params;

    const products = _id ? await getProductById(_id) : await getAllProducts();

    res.json({
      staus: "success",
      message: "product list",
      products,
    });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/",
  newProductValidation,
  upload.array("images", 5),
  async (req, res, next) => {
    try {
      //form data => req.body

      const newImages = req.files;

      //image => req.files
      const images = newImages.map((item, i) => item.path);
      req.body.images = images;
      req.body.mainImage = images[0];
      req.body.slug = slugify(req.body.name, {
        trim: true,
        lower: true,
      });
      const result = await createProduct(req.body);

      //get form data
      //get images

      if (result?._id) {
        return res.json({
          status: "success",
          message: "The product has been added!",
        });
      }

      res.json({
        status: "error",
        message: "Error adding new product, contact administration",
      });
    } catch (error) {
      if (error.message.includes("E11000 duplicate key error collection")) {
        error.errorCode = 200;
        error.message =
          "There is already another product has same slug, please change the name and try again later as the slug must be unique.";
      }
      next(error);
    }
  }
);

router.put(
  "/",
  editProductValidation,
  upload.array("newImages", 5),
  async (req, res, next) => {
    try {
      //get the product id
      const { _id, ...rest } = req.body;

      //set the new image path
      //remove the deleted item
      const imgToDeleteArg = req.body.imgToDelete.split(",");

      //convert string to array
      req.body.images = req.body?.images.split(",");

      const oldImages =
        req.body?.images?.filter((item) => !imgToDeleteArg?.includes(item)) ||
        [];

      const newImages = req.files;

      //image => req.files
      const newImagesPath = newImages.map((item) => item.path);
      req.body.images = [...oldImages, ...newImagesPath];

      const result = await updateProduct(_id, req.body);
      //get form data
      //get images

      if (result?._id) {
        return res.json({
          status: "success",
          message: "The product has been updated!",
        });
      }

      res.json({
        status: "error",
        message: "Error updating new product, please contact administration",
      });
    } catch (error) {
      next(error);
    }
  }
);

router.delete("/", async (req, res, next) => {
  try {
    const ids = req.body;

    const { deletedCount } = await deleteProducts(ids);

    deletedCount
      ? res.json({
          status: "success",
          message: "Selected products has been deleted",
        })
      : res.json({
          status: "error",
          message: "Unable to delete the products, please try again later",
        });
  } catch (error) {
    next(error);
  }
});

export default router;
