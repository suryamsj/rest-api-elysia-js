import Elysia, { t } from "elysia";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "./handlers";
import { hashPassword } from "../../utils/hash";
import bearer from "@elysiajs/bearer";
import { jwtConfig } from "../../utils/jwt.config";

const userRoutes = new Elysia({ prefix: "/user" })
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
  .get("/", () => getUsers(), {
    beforeHandle({ bearer, set, status }) {
      if (!bearer) {
        set.headers[
          "WWW-Authenticate"
        ] = `Bearer realm='sign', error="invalid_request"`;
        return status(401, "Unauthorized");
      }
    },
    detail: { tags: ["Users"] },
  })
  .get("/:id", ({ params: { id } }) => getUser(id), {
    beforeHandle({ bearer, set, status }) {
      if (!bearer) {
        set.headers[
          "WWW-Authenticate"
        ] = `Bearer realm='sign', error="invalid_request"`;
        return status(401, "Unauthorized");
      }
    },
    detail: { tags: ["Users"] },
  })
  .post(
    "/",
    async ({ body }) => {
      const { name, email, password } = body;
      const hashedPassword = await hashPassword(password);
      return createUser({ name, email, password: hashedPassword });
    },
    {
      beforeHandle({ bearer, set, status }) {
        if (!bearer) {
          set.headers[
            "WWW-Authenticate"
          ] = `Bearer realm='sign', error="invalid_request"`;
          return status(401, "Unauthorized");
        }
      },
      detail: { tags: ["Users"] },
      body: t.Object({
        name: t.String({
          minLength: 3,
          error: "Name is required",
        }),
        email: t.String({
          format: "email",
          minLength: 3,
          error: "Email is required",
        }),
        password: t.String({
          minLength: 8,
          error: "Password must be at least 8 characters long",
        }),
      }),
    }
  )
  .patch(
    "/:id",
    async ({ params: { id }, body }) => {
      if (body.password) {
        const hashedPassword = await hashPassword(body.password);
        return updateUser(id, { ...body, password: hashedPassword });
      }
      return updateUser(id, body);
    },
    {
      beforeHandle({ bearer, set, status }) {
        if (!bearer) {
          set.headers[
            "WWW-Authenticate"
          ] = `Bearer realm='sign', error="invalid_request"`;
          return status(400, "Unauthorized");
        }
      },
      detail: { tags: ["Users"] },
      body: t.Object({
        name: t.Optional(
          t.String({
            minLength: 3,
            error: "Name is required",
          })
        ),
        email: t.Optional(
          t.String({
            format: "email",
            minLength: 3,
            error: "Email is required",
          })
        ),
        password: t.Optional(
          t.String({
            minLength: 8,
            error:
              "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
          })
        ),
      }),
    }
  )
  .delete("/:id", ({ params: { id } }) => deleteUser(id), {
    beforeHandle({ bearer, set, status }) {
      if (!bearer) {
        set.headers[
          "WWW-Authenticate"
        ] = `Bearer realm='sign', error="invalid_request"`;
        return status(400, "Unauthorized");
      }
    },
    detail: { tags: ["Users"] },
  });

export default userRoutes;
