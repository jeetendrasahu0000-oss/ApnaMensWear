import express from "express";
import {
  DeleteCategory,
  DeleteSubCategory,
  AddSubCategory,
  CreateCategory,
  GetAdminCategories,
  GetCategories,
  UpdateCategory,
  UpdateSubCategory,
} from "../controllers/CategoryController.js";
import {
  Authontication,
  Authorization,
} from "../../user/middleware/AuthMiddleware.js";

const router = express.Router();

router.get("/", GetCategories);
router.get("/admin", Authontication, Authorization(["admin"]), GetAdminCategories);
router.post("/", Authontication, Authorization(["admin"]), CreateCategory);
router.post("/subcategories",Authontication,Authorization(["admin"]),AddSubCategory);
router.patch("/", Authontication, Authorization(["admin"]), UpdateCategory);
router.delete("/", Authontication, Authorization(["admin"]), DeleteCategory);
router.patch("/subcategories",Authontication,Authorization(["admin"]),UpdateSubCategory);
router.delete( "/subcategories", Authontication, Authorization(["admin"]),DeleteSubCategory);

export default router;
