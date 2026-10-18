import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { AppError } from "../utils/AppError";
import { prisma } from "../utils/prisma";

const publicUserSelect = { id: true, name: true, email: true, createdAt: true } as const;

export const registerUser = async (input: {
  name: string;
  email: string;
  password: string;
}) => {
  const password = await bcrypt.hash(input.password, 12);

  try {
    return await prisma.user.create({
      data: { ...input, password },
      select: publicUserSelect
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new AppError(409, "An account with this email already exists");
    }
    throw error;
  }
};

export const authenticateUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError(401, "Email or password is incorrect");
  }

  const { password: _password, ...publicUser } = user;
  return publicUser;
};

export const getPublicUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: publicUserSelect
  });

  if (!user) {
    throw new AppError(401, "The account for this access token no longer exists");
  }

  return user;
};
