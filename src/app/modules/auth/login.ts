import { Request, Response } from "express";
import { failed, success } from "@util/responseParser";
import { getRepository } from "typeorm";

import * as _ from "underscore";
import * as jwt from "jsonwebtoken";
import config from "@config/config";

import { User } from "@database/entity/User";
import { UserMap } from "@util/mapper/userMapper";

export default async function login(request: Request, response: Response) {
  try {
    let { email, password } = request.body;
    if (!(email && password)) {
      return response.status(400).send(
        failed({
          name: "LOGIN-EMPTY",
          message: "Username & Password needed!",
        })
      );
    }

    // Get user from database
    const userRepository = getRepository(User);
    let user: User;

    try {
      user = await userRepository.findOneOrFail({
        where: { email },
        relations: ["roles", "permissions"],
      });
    } catch (error) {
      return response.status(404).send(
        failed({
          name: "LOGIN-NOTFOUND",
          message: "User not found.",
        })
      );
    }

    // Check if encrypted password match
    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      return response.status(401).send(
        failed({
          name: "LOGIN-WRONG",
          message: "Password does not match!",
        })
      );
    }

    //SECTION Sign JWT, valid for 1 hour
    const token = jwt.sign(
      { id: user.uuid, username: user.username, email: user.email },
      config.jwtSecret,
      {
        expiresIn: config.jwtTimer,
      }
    );

    //Send the jwt in the response
    return response.status(200).send(
      success({
        name: "Login",
        message: "Successfully Logged In",
        data: {
          user: {
            ...UserMap(user),
            fullname: `${user.firstname} ${user.lastname}`,
          },
          token: token,
        },
      })
    );
  } catch (error) {
    return response.status(401).send(failed(error));
  }
}
