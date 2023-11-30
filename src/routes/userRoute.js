import express from "express";
import userController from "../controllers/userController";

const router = express.Router();

router.get("/", userController.getUsers);
router.post("/register", userController.createUser);
router.post("/login", userController.login);
router
  .route("/:id")
  .get(userController.getUserById)
  .put(userController.updateUser)
  .delete(userController.deleteUser);
router.delete("/delete/all", userController.deleteAll);



export default router;
