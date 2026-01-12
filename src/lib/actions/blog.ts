"use server";

import z from "zod";
import { api } from "../../../convex/_generated/api";
import { fetchAuthMutation } from "../auth-server";
import { blogSchema } from "../schemas/blog";

export async function createBlogAction(values: z.infer<typeof blogSchema>) {
  const parsed = blogSchema.safeParse(values);

  if (!parsed.success) {
    throw new Error("Invalid blog data");
  }

  await fetchAuthMutation(api.blog.createBlog, {
    title: parsed.data.title,
    content: parsed.data.content,
  });
}
