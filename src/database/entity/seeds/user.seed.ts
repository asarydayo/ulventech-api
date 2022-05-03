import { getRepository } from "typeorm";
import * as faker from "faker";
import * as _ from "underscore";

import { User } from "@database/entity/User";
import { Role } from "@database/entity/Role";

const gender = faker.random.number(1);

export default async function generateUser(count: number = 1) {
  const UserRepository = getRepository(User);
  const RoleRepository = getRepository(Role);
  var generatedUsers: User[] = [];
  var findAllRole = await RoleRepository.find();

  for (let index = 0; index < count; index++) {
    var email = faker.internet.email();
    console.log(`Seeding User : ${email}/password`);
    const user = new User();
    user.username = faker.internet.userName();
    user.firstname = faker.name.firstName(gender);
    user.lastname = faker.name.lastName(gender);
    user.email = email;
    user.password = "password";
    user.hashPassword();
    user.roles = _.sample(findAllRole, 2);
    generatedUsers.push(user);
  }

  await UserRepository.save(generatedUsers);
}
