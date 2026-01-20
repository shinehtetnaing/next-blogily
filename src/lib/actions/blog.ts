"use server";

import { updateTag } from "next/cache";
import z from "zod";
import { api } from "../../../convex/_generated/api";
import { fetchAuthMutation } from "../auth-server";
import { blogSchema } from "../schemas/blog";

export async function createBlogAction(values: z.infer<typeof blogSchema>) {
  try {
    const parsed = blogSchema.safeParse(values);

    if (!parsed.success) {
      throw new Error("Invalid blog data");
    }

    const imageUrl = await fetchAuthMutation(
      api.blog.generateImageUploadUrl,
      {},
    );

    const result = await fetch(imageUrl, {
      method: "POST",
      headers: { "Content-Type": parsed.data.image.type },
      body: parsed.data.image,
    });

    if (!result.ok) {
      throw new Error("Failed to upload image");
    }

    const { storageId } = await result.json();

    await fetchAuthMutation(api.blog.createBlog, {
      title: parsed.data.title,
      content: parsed.data.content,
      imageStorageId: storageId,
    });
  } catch (error) {
    throw new Error("Failed to create blog: " + (error as Error).message);
  }

  updateTag("blogs-list");
}
