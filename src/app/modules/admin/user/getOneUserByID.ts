import { Request, Response } from "express";
import { getRepository, Like, Not, IsNull } from "typeorm";
import { failed, success } from "@util/responseParser";
import { UserMap } from "@util/mapper/userMapper";
import * as _ from "underscore";

import { User } from "@database/entity/User";

export default async function getAllUser(request: Request, response: Response) {
  try {
    // Prepare User Repository &  Find the user based on UUID
    const UserRepository = getRepository(User);
    await UserRepository.findOneOrFail({
      withDeleted: true,
      where: { uuid: request.params.uuid },
      relations: ["roles", "permissions"],
    })
      .then((succ) => {
        // Return the result with 200
        return response.status(200).send(
          success({
            name: "USER-SRO",
            message: "User fetched successfully.",
            data: UserMap(succ),
          })
        );
      })
      .catch((error) => {
        // Return the result with 200
        return response.status(404).send(success(error));
      });
  } catch (e) {
    // Return Error Result
    return response.status(e.status).send(failed(e));
  }
}
