import { NextFunction, Request, Response } from "express"

export const logIncomingRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next()
}
