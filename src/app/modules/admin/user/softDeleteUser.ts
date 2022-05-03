import { Request, Response } from "express";
import { getRepository, Like, Not, IsNull } from "typeorm";
import { failed, success } from "@util/responseParser";

import * as _ from "underscore";

import { User } from "@database/entity/User";

export default async function softDeleteUser(
  request: Request,
  response: Response
) {
  try {
    const UserRepository = getRepository(User);
    var WaitingList: User[] = [];
    await Promise.all(
      request.body.list.map(async (item) => {
        await UserRepository.findOneOrFail({ where: { uuid: item } }).then(
          (success) => {
            WaitingList.push(success);
          }
        );
      })
    );

    // Deactivate Everything
    await UserRepository.softRemove(WaitingList);

    // Success returns
    return response.status(200).send(
      success({
        name: "USER-SU",
        message: "User(s) successfully deactivated.",
      })
    );
  } catch (e) {
    // Return Error Result
    return response.status(500).send(failed(e));
  }
}
