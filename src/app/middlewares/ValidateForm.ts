import { Request, Response, NextFunction } from "express";

import { validationResult } from "express-validator";
import { success, failed } from "@util/responseParser";

export const ValidateForm = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(422).send(
      failed({
        name: "ValidationError",
        message: "Validation Error",
        data: errors.array(),
      })
    );
  }
  return next();
};
