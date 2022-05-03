import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { failed, success } from "@util/responseParser";

import * as _ from "underscore";

import { Role } from "@database/entity/Role";
import { RoleSelectMapper } from "@util/mapper/roleMapper";

export default async function roleSelect(request: Request, response: Response) {
  try {
    // Prepare User Repository
    const RoleRepository = getRepository(Role);
    await RoleRepository.find()
      .then((ok) => {
        return response.status(200).send(
          success({
            name: "HELPER-ROLE-SUCCESS",
            message: "Successfully fetched country data.",
            data: ok.map((item) => RoleSelectMapper(item)),
          })
        );
      })
      .catch((err) => {
        return response
          .status(500)
          .send({ name: "HELPER-ROLE-FAILED", ...err });
      });
  } catch (e) {
    // Return Error Result
    return response.status(500).send(failed(e));
  }
}
