import { getRepository, MigrationInterface, QueryRunner } from "typeorm";
import UserSeed from "@database/entity/seeds/user.seed";
import RoleSeed from "@database/entity/seeds/role.seed";
import PermSeed from "@database/entity/seeds/perm.seed";

export class SeedStarter1593729736280 implements MigrationInterface {
  public async up(_: QueryRunner): Promise<any> {
    await PermSeed();
    await RoleSeed();
    await UserSeed(10);
  }

  public async down(_: QueryRunner): Promise<any> {
    // do nothing
  }
}
