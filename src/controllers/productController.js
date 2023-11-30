import Product from "../model/productModel";
import { tryCatchHandler } from "../helper/tryCatchHandler";
import { uploadToCloud } from "../helper/cloud";

const productController = {
  createProduct: tryCatchHandler(async (req, res) => {
    let uploadedImages = [];
    for (let index = 0; index < req.files["images"].length; index++) {
      uploadedImages.push(await uploadToCloud(req.files["images"][index], res));
    }
    let product = await Product.create({
      ...req.body,
      images: uploadedImages.map((item) => item.secure_url),
    });
    return res.json({
      status: "success",
      product,
    });
  }),

  getProducts: tryCatchHandler(async (req, res) => {
    const products = await Product.find();
    return res.json({
      status: "success",
      results: products.length,
      data: {
        products,
      },
    });
  }),
  getProductById: tryCatchHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res.json({
      status: "success",
      data: {
        product,
      },
    });
  }),
  updateProduct: tryCatchHandler(async (req, res) => {
    let updatedData;
    console.log(req.files);
    if (req.files["images"]) {
      let uploadedImages = [];
      for (let index = 0; index < req.files["images"].length; index++) {
        uploadedImages.push(
          await uploadToCloud(req.files["images"][index], res)
        );
      }
      updatedData = {
        ...req.body,
        images: uploadedImages.map((item) => item.secure_url),
      };
    } else {
      updatedData = req.body;
    }

    let product = await Product.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res.json({
      status: "success",
      message: "Product updated successfully",
      data: {
        product,
      },
    });
  }),
  deleteProduct: tryCatchHandler(async (req, res) => {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      {
        new: true,
      }
    );
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res.json({
      status: "success",
      message: "Product deleted successfully",
    });
  }),
  deleteAll: tryCatchHandler(async (req, res) => {
    await Product.deleteMany();
    return res.json({
      status: "success",
      message: "All products deleted successfully",
    });
  }),
};

export default productController;
