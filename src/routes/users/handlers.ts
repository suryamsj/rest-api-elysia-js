import { NotFoundError } from "elysia";
import db from "../../db";

export async function getUsers() {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return users;
  } catch (error) {
    console.log("Error fetching users:", error);
  }
}

export async function getUser(id: string, email?: string) {
  try {
    const user = await db.user.findUnique({
      where: {
        id: id,
        email: email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) throw new NotFoundError("User not found");
    return user;
  } catch (error) {
    console.log("Error fetching user:", error);
  }
}

export async function createUser(options: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    const user = await db.user.create({
      data: options,
    });
    return user;
  } catch (error) {
    console.log("Error creating user:", error);
  }
}

export async function updateUser(
  id: string,
  options: { name?: string; email?: string; password?: string }
) {
  try {
    const user = await db.user.update({
      where: {
        id: id,
      },
      data: {
        ...(options.name ? { name: options.name } : {}),
        ...(options.email ? { email: options.email } : {}),
        ...(options.password ? { password: options.password } : {}),
      }
    });
    return user;
  } catch (error) {
    console.log("Error updating user:", error);
  }
}

export async function deleteUser(id: string) {
  try {
    const user = await db.user.delete({
      where: {
        id: id,
      }
    });
    return user;
  } catch (error) {
    console.log("Error deleting user:", error);
  }
}
