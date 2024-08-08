import { Hono } from "hono";
import { cors } from "hono/cors";
import { userRoute } from "./Routes/userRoute";
import { blogRoute } from "./Routes/blogRoute";

type Bindings = {
  MY_BUCKET: R2Bucket;
  DATABASE_URL: string;
  JWT_PASSWORD: string;
};
type Variables = {};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();
app.use(cors());
app.route("/api/v1/user", userRoute);
app.route("/api/v1/blog", blogRoute);

export default app;
