import Elysia, { t } from "elysia";
import { signIn, signUp } from "./handlers";
import { jwtConfig } from "../../utils/jwt.config";
import { hashPassword } from "../../utils/hash";

const authRoutes = new Elysia({ prefix: "/auth" })
  .use(jwtConfig)
  .post(
    "/login",
    async ({ jwt, body, set }) => {
      const { email, password } = body;

      const user = await signIn({ email, password });
      if (user === null) {
        set.status = 401;
        return {
          error: "Invalid email or password",
        };
      }
      const token = await jwt.sign({ userId: user?.id || "", role: user?.role || "" });
      return { token };
    },
    {
      detail: { tags: ["Auth"] },
      body: t.Object({
        email: t.String({
          format: "email",
          error: "Invalid email",
        }),
        password: t.String({
          minLength: 8,
          error: "Password is required",
        }),
      }),
    }
  )
  .post("/register", async({ body }) => {
    const {name, email, password} = body;
    const hashedPassword = await hashPassword(password);
    return signUp({name, email, password: hashedPassword});
  }, {
    detail: { tags: ["Auth"] },
    body: t.Object({
      name: t.String({
        minLength: 3,
        error: "Name is required",
      }),
      email: t.String({
        format: "email",
        error: "Invalid email",
      }),
      password: t.String({
        minLength: 8,
        error:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      }),
    }),
  });

export default authRoutes;
