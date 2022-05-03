import * as faker from "faker";
import { getRepository } from "typeorm";
import { Role } from "@database/entity/Role";
import { Permission } from "@database/entity/Permission";

export default async function generateRoles() {
  const RoleRepository = getRepository(Role);
  const PermissionRepository = getRepository(Permission);
  var generatedRoles: Role[] = [];
  console.log(`Seeding Roles`);
  // Admin Seed
  const admin = new Role();
  admin.name = "Admin";
  admin.description = faker.random.words(5);
  admin.permissions = await PermissionRepository.find();
  generatedRoles.push(admin);

  // Moderator Seed
  const mod = new Role();
  mod.name = "Moderator";
  mod.description = faker.random.words(5);
  generatedRoles.push(mod);

  // Poster Seed
  const member = new Role();
  member.name = "Member";
  member.description = faker.random.words(5);
  generatedRoles.push(member);

  // Poster Seed
  const customer = new Role();
  customer.name = "Customer";
  customer.description = faker.random.words(5);
  generatedRoles.push(customer);

  await RoleRepository.save(generatedRoles);
}
