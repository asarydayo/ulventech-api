import {
  Entity,
  ManyToMany,
  OneToMany,
  JoinTable,
  Column,
  Unique,
} from "typeorm";
import { Length, IsNotEmpty } from "class-validator";

import { General } from "./BaseEntity";
import { User } from "./User";
import { Permission } from "./Permission";

@Entity()
@Unique(["name"])
export class Role extends General {
  @Column({ type: "varchar" })
  name: string;

  @Column({ nullable: true, type: "varchar" })
  @Length(4, 128)
  description: string;

  @ManyToMany((type) => Permission, { eager: true })
  @JoinTable()
  permissions: Permission[];

  @ManyToMany((type) => User, { eager: false })
  users: User[];
}
