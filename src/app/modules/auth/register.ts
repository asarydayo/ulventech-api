import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { failed, success } from "@util/responseParser";

import * as path from "path";
import * as _ from "underscore";

import { User } from "@database/entity/User";
import { Role } from "@database/entity/Role";
import { Permission } from "@database/entity/Permission";

export default async function register(request: Request, response: Response) {
  try {
    // Destructure the body
    var {
      uuid,
      email,
      username,
      firstname,
      lastname,
      password,
      bio,
      permissions,
      roles,
    } = request.body;

    // Prepare the Repository
    const UserRepository = getRepository(User);

    // Find the user based on UUID
    var UserDetail = new User();

    // Populate with new values
    UserDetail.uuid = uuid;
    UserDetail.email = email;
    UserDetail.username = username;
    UserDetail.firstname = firstname;
    UserDetail.lastname = lastname;

    // If Password is Filled, update it
    if (password) {
      UserDetail.password = password;
      UserDetail.hashPassword();
    }

    // If Perms is Filled, update it
    if (permissions) {
      const PermisssionRepository = getRepository(Permission);
      var NewPermissions: Permission[] = [];
      permissions.split(",").map((item) => {
        PermisssionRepository.findOneOrFail(item).then((success) =>
          NewPermissions.push(success)
        );
      });
      UserDetail.permissions = NewPermissions;
    }

    // If Role is Filled, update it
    if (roles) {
      const RoleRepository = getRepository(Role);
      var NewRoles: Role[] = [];
      if (Array.isArray(roles)) {
        await Promise.all(roles.map(async (item) => {
          await RoleRepository.findOneOrFail({
            where: { name: item },
          }).then((success) => NewRoles.push(success));
        }));
      } else {
        await RoleRepository.findOneOrFail({
          where: { name: roles },
        }).then((success) => NewRoles.push(success));
      }
      UserDetail.roles = NewRoles;
    }

    // Save the new Data
    console.log(UserDetail)
    await UserRepository.save(UserDetail);

    // Return the result with 200
    return response.status(200).send(
      success({
        name: "USER-SC",
        message: "User successfully created.",
      })
    );
  } catch (e) {
    // Return Error Result
    return response.status(500).send(failed(e));
  }
}
