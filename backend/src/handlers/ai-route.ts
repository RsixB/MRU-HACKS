import type { Request, Response, NextFunction} from "express-serve-static-core";

export const getResults = async (req: Request, res: Response) => {
  try {
  } catch (e) {
    return res.send({
      err: true
    })
  }
}