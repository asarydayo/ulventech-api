import { Router } from "express";
import auth from "./auth";
import hello from "../modules/hello";

import { checkJwt } from "@middlewares/checkJwt";
import { checkRole } from "@middlewares/checkRole";


const routes = Router();

routes.use("/auth", auth);
routes.get("/admin/hello",[checkJwt, checkRole(["Admin"])], hello);
routes.get("/customer/hello",[checkJwt, checkRole(["Customer"])], hello);

export default routes;
