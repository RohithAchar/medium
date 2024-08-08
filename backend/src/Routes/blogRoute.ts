import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { CreateBlogData } from "@rohith_achar/medium";
import { Hono } from "hono";
import { decode, verify } from "hono/jwt";

type Bindings = {
  MY_BUCKET: R2Bucket;
  DATABASE_URL: string;
  JWT_PASSWORD: string;
};

type Variables = {
  id: string;
  email: string;
};

export const blogRoute = new Hono<{
  Bindings: Bindings;
  Variables: Variables;
}>();

blogRoute.use("/*", async (c, next) => {
  const header = c.req.header("Authorization");
  if (!header)
    return c.json(
      {
        msg: "Unauthorized user",
      },
      401
    );

  try {
    await verify(header, c.env.JWT_PASSWORD);
    const { payload } = decode(header);
    c.set("email", payload.email + "");
    c.set("id", payload.id + "");
    await next();
  } catch (error) {
    return c.json(
      {
        msg: error,
      },
      401
    );
  }
});

blogRoute.post("/", async (c) => {
  const body: CreateBlogData = await c.req.json();
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const blog = await prisma.post.create({
    data: {
      title: body.title,
      description: body.description,
      authorId: parseInt(c.get("id")),
    },
  });

  return c.json({
    blog,
  });
});

blogRoute.get("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const blogs = await prisma.post.findMany({
    where: {},
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });
  return c.json({
    blogs,
  });
});

blogRoute.get("/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const id = parseInt(c.req.param("id"));

  if (!id)
    return c.json(
      {
        error: "Unauthorized",
      },
      401
    );

  const blog = await prisma.post.findFirst({
    where: { id: id },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });

  return c.json({
    blog,
  });
});
