// import { PrismaClient } from "@prisma/client";

import { PrismaClient } from "./generated/client/";

declare global {
  // This line declares a global variable that is used to store the prisma client instance
  var prisma: PrismaClient | undefined;
}

// This line checks if a prisma client instance already exists in the global variable. If it does, it uses that instance. If it doesn't, it creates a new Prisma client instance.
const prisma = global.prisma || new PrismaClient();

// This line assigns the Prisma client instance to the global variable only if the application is running in the devlopment environment. This is done to ensure that a new Prisma client instance is created every time the application is started in the development environment.
if (process.env.NODE_ENV === "development") {
  global.prisma = prisma;
}

export default prisma;
