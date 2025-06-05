import { Elysia } from "elysia";
import { node } from "@elysiajs/node";
import userRoutes from "./routes/users";
import swagger from "@elysiajs/swagger";
import productRoutes from "./routes/products";
import authRoutes from "./routes/auth";

const app = new Elysia({ adapter: node() });

app
  .use(
    swagger({
      path: "/v1/swagger",
      documentation: {
        info: {
          title: "API Inventory",
          version: "1.0.0",
        },
        tags: [
          { name: "Root", description: "Root API" },
          { name: "Auth", description: "Auth API" },
          { name: "Users", description: "Users API" },
          { name: "Products", description: "Products API" },
        ],
      },
    })
  )
  .get(
    "/",
    () => {
      return {
        message: "Welcome to API Inventory",
        documentation: "/v1/swagger",
      };
    },
    { detail: { tags: ["Root"] } }
  )
  .group("/v1/api", (app) => app.use(authRoutes))
  .group("/v1/api", (app) => app.use(userRoutes))
  .group("/v1/api", (app) => app.use(productRoutes))
  .listen(process.env.PORT ?? 3000);
