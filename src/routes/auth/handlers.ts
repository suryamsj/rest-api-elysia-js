import { NotFoundError } from "elysia";
import { comparePasswords } from "../../utils/hash";
import db from "../../db";

export async function signIn(options: { email: string; password: string }) {
  try {
    const user = await db.user.findUnique({
      where: {
        email: options.email,
      },
    });
    if (!user) {
      throw new NotFoundError("User not found");
    }
    const isPasswordValid = await comparePasswords(
      options.password,
      user.password
    );

    if (!isPasswordValid) return null;

    return {
        id: user.id,
        role: user.role
    };
  } catch (error) {
    console.log("Failed to sign in: ", error);
  }
}

export async function signUp(options: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    const user = await db.user.create({
      data: {
        name: options.name,
        email: options.email,
        password: options.password,
      },
    });
    return user;
  } catch (error) {
    console.log("Failed to create user: ", error);
  }
}
