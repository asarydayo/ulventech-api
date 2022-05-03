import { Router } from "express";
import { checkJwt } from "@middlewares/checkJwt";
import { check } from "express-validator";
import { ValidateForm } from "@middlewares/ValidateForm";

import Register from "@auth/register";
import Login from "@auth/login";
import Me from "@auth/Me";

const router = Router();
// Login route
router.post(
  "/login",
  [
    check("email").isEmail().notEmpty(),
    check("password").notEmpty(),
    ValidateForm,
  ],
  Login
);

// Login route

// Create a new user
router.post(
  "/register",
  [
    check("email").isEmail().notEmpty(),
    check("username").notEmpty(),
    check("firstname").isString().isLength({ min: 1, max: 32 }).notEmpty(),
    check("lastname").isString().isLength({ min: 1, max: 32 }).notEmpty(),
    check("password").isString().isLength({ min: 8, max: 32 }).notEmpty(),
    ValidateForm,
  ],
  Register
);

// Login route
router.get("/me", [checkJwt], Me);

export default router;
