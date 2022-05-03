import { Router } from "express";
import { checkJwt } from "@middlewares/checkJwt";

import countrySelect from "@helper/countrySelect";
import maslowSelect from "@helper/maslowSelect";
import roleSelect from "@helper/roleSelect";

const router = Router();
// Login route
router.get("/select_country", [checkJwt], countrySelect);
router.get("/select_maslow", [checkJwt], maslowSelect);
router.get("/select_role", [checkJwt], roleSelect);

export default router;
