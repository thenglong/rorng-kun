import { NextFunction, Request, Response } from "express"

import { Role } from "prisma/prisma-client"

import { getClaims } from "../services/firebase.service"

export interface UserClaims {
  email: string
  uid: string
  roles: Role[]
}

export interface RequestWithUser extends Request {
  user: UserClaims
}

export const roleAuthorizer = (...roles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers
    if (!authorization) {
      // next(createError(BadRequest, "Authorization header is required"))
    }
    const user = await getClaims(authorization)

    const hasAccess =
      user?.roles.some(role => roles.includes(role)) || !roles.length
    if (hasAccess) {
      req["user"] = user
      next()
    } else {
      // next(createError(Unauthorized, "User does not have access"))
    }
  }
}
