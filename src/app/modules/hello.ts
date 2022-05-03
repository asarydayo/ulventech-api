import { Request, Response } from "express";
import { failed, success } from "@util/responseParser";

import * as _ from "underscore";


export default async function getAllUser(request: Request, response: Response) {
  try {
    return response.status(200).send(
      success({
        name: "HELLO-SUCCESS",
        message: "Successfully said hello.",
        data: "hello world",
      })
    );
  } catch (e) {
    // Return Error Result
    return response.status(500).send(failed(e));
  }
}
