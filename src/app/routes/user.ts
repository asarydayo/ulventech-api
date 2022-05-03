import { Router } from "express";
import { checkJwt } from "@middlewares/checkJWT";
import { checkPermission } from "@middlewares/checkPermission";
import { ValidateForm } from "@middlewares/ValidateForm";

// For Form Validation
import { check } from "express-validator";

import getAllUser from "@admin/user/getAllUser";
import getOneUserByID from "@admin/user/getOneUserByID";
import updateUser from "@admin/user/updateUser";
import createUser from "@admin/user/createUser";
import DeleteUser from "@admin/user/deleteUser";
import SoftDeleteUser from "@admin/user/softDeleteUser";
import RecoverUser from "@admin/user/recoverUser";

// For File Uploads
import { v4 as uuidv4 } from "uuid";
import * as multer from "multer";
import * as path from "path";
import * as slugify from "@sindresorhus/slugify";
import * as fs from "fs";

// Params for File Upload
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    req.body.uuid = req.params.uuid ? req.params.uuid : uuidv4();
    const dir = `./public/user_files/${slugify(req.body.uuid, {
      separator: "-",
    })}/`;
    fs.exists(dir, (exist) => {
      if (!exist) {
        return fs.mkdir(dir, (error) => cb(error, dir));
      }
      cb(null, dir);
    });
  },
  filename: function (req, file, cb) {
    cb(
      null,
      slugify(`profile_picture_` + new Date().getTime() + file.originalname) +
        path.extname(file.originalname)
    );
  },
});

const processFile = multer({ storage: storage });
const router = Router();

// Get all users
router.get("/", [checkJwt, checkPermission(["read_user"])], getAllUser);

// Get One Specific User
router.get(
  "/:uuid",
  [checkJwt, checkPermission(["read_user"])],
  getOneUserByID
);

// Create a new user
router.post(
  "/",
  [
    checkJwt,
    processFile.single("profile_image"),
    check("email").isEmail().notEmpty(),
    check("username").notEmpty(),
    check("firstname").isString().isLength({ min: 1, max: 32 }).notEmpty(),
    check("lastname").isString().isLength({ min: 1, max: 32 }).notEmpty(),
    check("password").isString().isLength({ min: 8, max: 32 }).notEmpty(),
    check("bio").isString().isLength({ min: 0, max: 255 }),
    ValidateForm,
    // upload.none(),
    checkPermission(["read_user"]),
  ],
  createUser
);

// Delete User(s)
router.delete("/", [checkJwt, checkPermission(["delete_user"])], DeleteUser);

// Soft Delete User(s)
router.delete(
  "/soft",
  [checkJwt, checkPermission(["delete_user"])],
  SoftDeleteUser
);

// Recover User(s)
router.patch(
  "/recover",
  [checkJwt, checkPermission(["update_user"])],
  RecoverUser
);

// Update User
router.put(
  "/:uuid",
  [
    checkJwt,
    processFile.single("profile_image"),
    check("email").isEmail().notEmpty(),
    check("username").isString().isLength({ min: 1, max: 32 }).notEmpty(),
    check("firstname").isString().isLength({ min: 1, max: 32 }).notEmpty(),
    check("lastname").isString().isLength({ min: 1, max: 32 }).notEmpty(),
    check("password").optional().isString().isLength({ min: 8, max: 32 }),
    check("bio").isString().isLength({ min: 0, max: 255 }),
    ValidateForm,
    // upload.none(),
    checkPermission(["update_user"]),
  ],
  updateUser
);

export default router;
