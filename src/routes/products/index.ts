import Elysia, { t } from "elysia";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "./handlers";
import bearer from "@elysiajs/bearer";
import { jwtConfig } from "../../utils/jwt.config";

const productRoutes = new Elysia({ prefix: "/product" })
  .use(bearer())
  .use(jwtConfig)
  .derive(async ({ bearer, jwt, set, status }) => {
    if (bearer) {
      const token = await jwt.verify(bearer);
      if (!token) {
        set.headers[
          "WWW-Authenticate"
        ] = `Bearer realm='sign', error="invalid_request"`;
        return status(401, "Unauthorized");
      }
    }
  })
  .get("/", () => getProducts(), {
    beforeHandle({ bearer, set, status }) {
      if (!bearer) {
        set.headers[
          "WWW-Authenticate"
        ] = `Bearer realm='sign', error="invalid_request"`;
        return status(401, "Unauthorized");
      }
    },
    detail: { tags: ["Products"] },
  })
  .get("/:id", ({ params: { id } }) => getProduct(id), {
    beforeHandle({ bearer, set, status }) {
      if (!bearer) {
        set.headers[
          "WWW-Authenticate"
        ] = `Bearer realm='sign', error="invalid_request"`;
        return status(401, "Unauthorized");
      }
    },
    detail: { tags: ["Products"] },
  })
  .post("/", ({ body }) => createProduct(body), {
    beforeHandle({ bearer, set, status }) {
      if (!bearer) {
        set.headers[
          "WWW-Authenticate"
        ] = `Bearer realm='sign', error="invalid_request"`;
        return status(401, "Unauthorized");
      }
    },
    detail: { tags: ["Products"] },
    body: t.Object({
      name: t.String({
        minLength: 3,
        error: "Name is required",
      }),
      description: t.Optional(
        t.String({
          minLength: 3,
          error: "Description is required",
        })
      ),
      price: t.Number({
        minimum: 1,
        error: "Price is required",
      }),
      stock: t.Number({
        minimum: 1,
        error: "Stock is required",
      }),
    }),
  })
  .patch("/:id", ({ params: { id }, body }) => updateProduct(id, body), {
    beforeHandle({ bearer, set, status }) {
      if (!bearer) {
        set.headers[
          "WWW-Authenticate"
        ] = `Bearer realm='sign', error="invalid_request"`;
        return status(401, "Unauthorized");
      }
    },
    detail: { tags: ["Products"] },
    body: t.Object(
      {
        name: t.Optional(t.String()),
        description: t.Optional(t.String()),
        price: t.Optional(t.Number()),
        stock: t.Optional(t.Number()),
      },
      {
        minProperties: 1,
      }
    ),
  })
  .delete("/:id", ({ params: { id } }) => deleteProduct(id), {
    beforeHandle({ bearer, set, status }) {
      if (!bearer) {
        set.headers[
          "WWW-Authenticate"
        ] = `Bearer realm='sign', error="invalid_request"`;
        return status(401, "Unauthorized");
      }
    },
    detail: { tags: ["Products"] },
  });

export default productRoutes;
