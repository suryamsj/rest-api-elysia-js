import { NotFoundError } from "elysia";
import db from "../../db";

export async function getProducts() {
  try {
    const products = await db.product.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

export async function getProduct(id: string) {
  try {
    const product = await db.product.findUnique({
      where: {
        id: id,
      },
    });

    if (!product) throw new NotFoundError("Product not found");

    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
  }
}

export async function createProduct(options: {
  name: string;
  description?: string;
  price: number;
  stock: number;
}) {
  try {
    const product = await db.product.create({
      data: options,
    });

    return product;
  } catch (error) {
    console.error("Error creating product:", error);
  }
}

export async function updateProduct(
  id: string,
  options: {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
  }
) {
  try {
    const product = await db.product.update({
      where: {
        id: id,
      },
      data: {
        ...(options.name ? { name: options.name } : {}),
        ...(options.description ? { description: options.description } : {}),
        ...(options.price ? { price: options.price } : {}),
        ...(options.stock ? { stock: options.stock } : {}),
      },
    });

    return product;
  } catch (error) {
    console.error("Error updating product:", error);
  }
}

export async function deleteProduct(id: string) {
  try {
    const product = await db.product.delete({
      where: {
        id: id,
      },
    });

    return product;
  } catch (error) {
    console.error("Error deleting product:", error);
  }
}
