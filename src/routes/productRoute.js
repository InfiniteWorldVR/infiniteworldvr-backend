import express from "express";
import productController from "../controllers/productController";
import multer from "multer";
import path from "path";

const upload = multer({
  storage: multer.diskStorage({
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `product-${Date.now()}${ext}`);
    },
  }),
});
const router = express.Router();

router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);
router.post(
  "/",
  upload.fields([
    { name: "images", maxCount: 4 },
    { name: "model", maxCount: 1 },
  ]),
  productController.createProduct
);
router.delete("/:id", productController.deleteProduct);
router.delete("/delete/all", productController.deleteAll);
router.put(
  "/:id",
  upload.fields([
    { name: "images", maxCount: 8 },
    { name: "model", maxCount: 1 },
  ]),
  productController.updateProduct
);

router.post(
  "/create-checkout-session",
  productController.createCheckoutSession
);
router.post("/webhook", productController.webhook);

router.get(
  "/get/checkout/sessions",
  productController.stripeGetAllCheckoutSessions
);

router.get("/get/balance", productController.getBalance);

export default router;
