import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { failed, success } from "@util/responseParser";

import * as path from "path";
import * as fs from "fs";
import * as _ from "underscore";

import { User } from "@database/entity/User";
import { File } from "@database/entity/File";
import { Role } from "@database/entity/Role";
import { Permission } from "@database/entity/Permission";
import { Maslow } from "@database/entity/Maslow";
import { Country } from "@database/entity/Country";

export default async function createUser(request: Request, response: Response) {
  try {
    // Destructure the body
    var {
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
    var UserDetail = await UserRepository.findOne({
      where: { uuid: request.params.uuid },
      relations: ["roles", "permissions"],
    });

    // Populate with new values
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

    // If file is uploaded, update it
    if (request.file) {
      // the file metadata
      var fileMeta = {
        filename: `${UserDetail.username} Profile Picture`,
        fileoject: request.file.filename,
        filetype: "profile_picture",
        fileext: path.extname(request.file.originalname),
        fileattrib: `${UserDetail.username} Profile Picture`,
      };

      if (UserDetail.profile_image) {
        // Delete previous profile pic if exists
        var filePath = path.resolve(
          `${process.cwd()}/public/user_files/${UserDetail.uuid}/${
            UserDetail.profile_image.file_object
          }`
        );
        fs.stat(filePath, (err, stats) => {
          if (!err) {
            fs.unlinkSync(filePath);
          }
        });
        // Update the file metadata to databse
        const FileRepository = getRepository(File);
        var ProfilePic = UserDetail.profile_image;
        ProfilePic.file_name = fileMeta.filename;
        ProfilePic.file_object = fileMeta.fileoject;
        ProfilePic.file_type = fileMeta.filetype;
        ProfilePic.file_extension = fileMeta.fileext;
        ProfilePic.file_attribute = fileMeta.fileattrib;
        ProfilePic.generateUrl(UserDetail.uuid);
        await FileRepository.save(ProfilePic);
      } else {
        // Create anew file metadata if didn't exist
        const FileRepository = getRepository(File);
        var newFile = new File();
        newFile.file_name = fileMeta.filename;
        newFile.file_object = fileMeta.fileoject;
        newFile.file_type = fileMeta.filetype;
        newFile.file_extension = fileMeta.fileext;
        newFile.file_attribute = fileMeta.fileattrib;
        newFile.generateUrl(UserDetail.uuid);
        await FileRepository.save(newFile);
        UserDetail.profile_image = newFile;
      }
    }

    // Save the new Data
    await UserRepository.save(UserDetail);

    // Return the result with 200
    return response.status(200).send(
      success({
        name: "USER-SU",
        message: "User updated successfully!",
      })
    );
  } catch (e) {
    // Return Error Result
    return response.status(500).send(failed(e));
  }
}
