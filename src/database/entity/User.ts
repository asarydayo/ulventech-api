import {
  Entity,
  Column,
  Unique,
  OneToOne,
  ManyToMany,
  ManyToOne,
  JoinTable,
  JoinColumn,
} from "typeorm";

import { Length, IsEmail } from "class-validator";
import * as bcrypt from "bcryptjs";

import { General } from "./BaseEntity";
import { Role } from "./Role";
import { Permission } from "./Permission";

@Entity()
@Unique(["username", "email"])
export class User extends General {
  @Column({ type: "varchar" })
  @Length(0, 128)
  username: string;

  @Column({ nullable: true, type: "varchar" })
  @Length(0, 128)
  firstname?: string;

  @Column({ nullable: true, type: "varchar" })
  @Length(0, 128)
  lastname?: string;

  @Column({ type: "varchar" })
  @IsEmail()
  email: string;

  @Column({ type: "varchar" })
  @Length(0, 128)
  password?: string;

  @Column({ type: "text", nullable: true  })
  bio?: string;

  @Column({ nullable: true })
  reset_token?: string;

  @ManyToMany((type) => Role, { eager: false })
  @JoinTable()
  roles?: Role[];

  @ManyToMany((type) => Permission, { eager: true })
  @JoinTable()
  permissions?: Permission[];

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }

  hashPassword() {
    if (this.password) {
      this.password = bcrypt.hashSync(this.password, 8);
    }
  }
}
