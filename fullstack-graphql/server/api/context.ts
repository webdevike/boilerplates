// api/context.ts
import {  db } from "./db";
import { PrismaClient } from "@prisma/client";
import * as auth from "./auth";

export interface Context {
  db: PrismaClient;
  auth: typeof auth;
}

export const context = {
  db,
  auth
};