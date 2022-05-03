import { Request, Response, NextFunction } from "express";
import * as _ from "underscore";

import { User } from "@database/entity/User";

import { success, failed } from "../utils/responseParser";

export const checkRole = (roles: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //Get the user ID from previous midleware
    const user = res.locals.user;
    if (!Boolean(user.roles.length)) {
      // return 403 if user doesn't have any role
      // !!! Subject to change in the future!
      return res.status(403).send(
        failed({
          name: "InsufficientRole",
          message: "You don't have any authorization to do this action.",
        })
      );
    } else {
      let is_allowed = roles.some(check_role=>{
        return user.roles.map(current_role => current_role.name).indexOf(check_role) > -1
      })

      if (is_allowed) {
        return next();
      }

      // Return 403 if none found
      return res.status(403).send(
        failed({
          name: "InsufficientRole",
          message: "You don't have any authorization to do this action.",
        })
      );
    }
  };
};
