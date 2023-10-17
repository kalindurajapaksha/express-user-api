import express from "express";
import { get, merge } from "lodash";

import { getUserBySessionToken } from "../db/users";

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies["KALEE-AUTH"];
    if (!sessionToken) res.sendStatus(403);

    const existingUser = await getUserBySessionToken(sessionToken);
    if (!existingUser) res.sendStatus(403);

    merge(req, { identity: existingUser });
    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, "identity._id") as string;
    if (!currentUserId) res.sendStatus(403);
    if (currentUserId !== id) res.sendStatus(403);
    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
