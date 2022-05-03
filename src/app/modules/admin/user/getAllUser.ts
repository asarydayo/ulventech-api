import { Request, Response } from "express";
import { getRepository, Like, Not, IsNull } from "typeorm";
import { failed, success } from "@util/responseParser";
import { UserMap } from "@util/mapper/userMapper";

import * as _ from "underscore";

import { User } from "@database/entity/User";

export default async function getAllUser(request: Request, response: Response) {
  try {
    // Prepare User Repository
    const UserRepository = getRepository(User);

    // Prepare the Pagination Variables
    const page = request.query.page ? Number(request.query.page) : 1;
    const per_page = request.query.per_page
      ? Number(request.query.per_page)
      : 4;
    const sort_order = request.query.sort_order == "ASC" ? "ASC" : "DESC";
    const sort_by = request.query.sort_by
      ? String(request.query.sort_by)
      : "id";
    const keyword = Boolean(request.query.keyword) ? request.query.keyword : "";
    const relations = request.query.relations
      ? String(request.query.relations).split(",")
      : ["roles", "permissions"];

    // Fetch the Data with prepared Variables
    await UserRepository.findAndCount({
      withDeleted: true,
      take: per_page,
      skip: page * per_page - per_page,
      where: [
        { firstname: keyword ? Like(`%${keyword}%`) : Not(IsNull()) },
        { lastname: keyword ? Like(`%${keyword}%`) : Not(IsNull()) },
        { email: keyword ? Like(`%${keyword}%`) : Not(IsNull()) },
        { username: keyword ? Like(`%${keyword}%`) : Not(IsNull()) },
      ],
      order: {
        [sort_by]: sort_order,
      },
      relations: relations,
    }).then((result) => {
      return response.status(200).send(
        success({
          name: "USER-SR",
          message: "Successfully fetched all user data",
          data: {
            data: result[0].map((item) => UserMap(item)),
            meta: {
              page: page,
              per_page: per_page,
              keyword: keyword,
              sort_by: sort_by,
              sort_order: sort_order,
              total_item_in_this_page: result[0].length,
              total_item: result[1] || 0,
              total_page: result[0] ? Math.ceil(result[1] / per_page) : 0,
            },
          },
        })
      );
    });
  } catch (e) {
    // Return Error Result
    return response.status(500).send(failed(e));
  }
}
