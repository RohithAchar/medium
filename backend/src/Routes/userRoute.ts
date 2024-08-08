import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { SignUpSchema, SignUpData } from "@rohith_achar/medium";
import { Hono } from "hono";
import { sign } from "hono/jwt";

type Bindings = {
  MY_BUCKET: R2Bucket;
  DATABASE_URL: string;
  JWT_PASSWORD: string;
};
type Variables = {};

export const userRoute = new Hono<{
  Bindings: Bindings;
  Variables: Variables;
}>();

userRoute.post("/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body: SignUpData = await c.req.json();
  const { success } = SignUpSchema.safeParse(body);
  if (!success)
    return c.json(
      {
        error: "Invalid input",
      },
      203
    );

  const { email, password, name } = body;
  try {
    const userExists = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (userExists)
      return c.json(
        {
          error: "User already exists",
        },
        409
      );
    const user = await prisma.user.create({
      data: {
        email: email,
        password: password,
        name: name,
      },
    });
    const jwt = await sign(
      { id: user.id, email: user.email },
      c.env.JWT_PASSWORD
    );

    return c.json(
      {
        jwt,
      },
      201
    );
  } catch (error) {
    return c.json(
      {
        error: "Something went wrong",
      },
      500
    );
  }
});

userRoute.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body: SignUpData = await c.req.json();
  const { success } = SignUpSchema.safeParse(body);
  if (!success)
    return c.json(
      {
        error: "Invalid input",
      },
      203
    );

  const { email, password } = body;
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
        password: password,
      },
    });
    if (user) {
      const jwt = await sign(
        { id: user.id, email: user.email },
        c.env.JWT_PASSWORD
      );
      return c.json({
        jwt,
      });
    }
    return c.json(
      {
        error: "Wrong email and password",
      },
      203
    );
  } catch (error) {
    return c.json(
      {
        error: "Something went wrong",
      },
      500
    );
  }
});
