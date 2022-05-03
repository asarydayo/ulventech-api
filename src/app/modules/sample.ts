import { Request, Response } from "express";
import { getRepository, Like, Not, IsNull } from "typeorm";
import { failed, success } from "@util/responseParser";

import * as _ from "underscore";

import { User } from "@database/entity/User";

export default async function getAllUser(request: Request, response: Response) {
  try {
    // Prepare User Repository
  } catch (e) {
    // Return Error Result
    return response.status(500).send(failed(e));
  }
}
