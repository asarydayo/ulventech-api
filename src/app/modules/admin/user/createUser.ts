import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { failed, success } from "@util/responseParser";

import * as path from "path";
import * as _ from "underscore";

import { User } from "@database/entity/User";
import { File } from "@database/entity/File";
import { Role } from "@database/entity/Role";
import { Permission } from "@database/entity/Permission";
import { Country } from "@database/entity/Country";
import { Maslow } from "@database/entity/Maslow";
import { count } from "console";

export default async function createUser(request: Request, response: Response) {
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
      country,
      maslow_status,
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
    UserDetail.bio = bio;

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

    if (country) {
      const CountryRepository = getRepository(Country);
      await CountryRepository.findOne({ where: { uuid: country } }).then(
        (ok) => {
          UserDetail.country = ok;
        }
      );
    }

    if (maslow_status) {
      const MaslowRepository = getRepository(Maslow);
      await MaslowRepository.findOne({ where: { uuid: maslow_status } }).then(
        (ok) => {
          UserDetail.maslow_status = ok;
        }
      );
    }

    // If Role is Filled, update it
    if (roles) {
      const RoleRepository = getRepository(Role);
      var NewRoles: Role[] = [];
      if (Array.isArray(roles)) {
        roles.map((item) => {
          RoleRepository.findOneOrFail({
            where: { uuid: item },
          }).then((success) => NewRoles.push(success));
        });
      } else {
        RoleRepository.findOneOrFail({
          where: { uuid: roles },
        }).then((success) => NewRoles.push(success));
      }
      UserDetail.roles = NewRoles;
    }
    // If file is uploaded, update it

    if (request.file) {
      //   Store the file metadata to databse
      const FileRepository = getRepository(File);
      var newFile = new File();
      let file = request.file;
      newFile.file_name = `${UserDetail.username} Profile Picture`;
      newFile.file_object = file.filename;
      newFile.file_type = "profile_picture";
      newFile.file_extension = path.extname(file.originalname);
      newFile.file_attribute = `${UserDetail.username} Profile Picture`;
      newFile.generateUrl(UserDetail.uuid);
      await FileRepository.save(newFile);
      UserDetail.profile_image = newFile;
    }

    // Save the new Data
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
