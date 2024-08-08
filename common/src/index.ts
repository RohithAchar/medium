import { string, z } from "zod";

export const SignUpSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  name: z.string().optional(),
});

export type SignUpData = z.infer<typeof SignUpSchema>;

export const CreateBlogSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export type CreateBlogData = z.infer<typeof CreateBlogSchema>;
