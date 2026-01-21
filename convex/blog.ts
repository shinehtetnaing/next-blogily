import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";
import { Doc } from "./_generated/dataModel";

// Create a new blog with the given title and content
export const createBlog = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    imageStorageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      throw new ConvexError("Not authenticated");
    }

    const newBlogId = await ctx.db.insert("blogs", {
      title: args.title,
      content: args.content,
      authorId: user._id,
      imageStorageId: args.imageStorageId,
    });
    return newBlogId;
  },
});

export const getBlogs = query({
  args: {},
  handler: async (ctx) => {
    const blogs = await ctx.db.query("blogs").order("desc").collect();

    return Promise.all(
      blogs.map(async (blog) => {
        const resolvedImageUrl =
          blog.imageStorageId !== undefined
            ? await ctx.storage.getUrl(blog.imageStorageId)
            : null;

        return {
          ...blog,
          imageUrl: resolvedImageUrl,
        };
      }),
    );
  },
});

export const generateImageUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      throw new ConvexError("Not authenticated");
    }

    return await ctx.storage.generateUploadUrl();
  },
});

export const getBlogById = query({
  args: { blogId: v.id("blogs") },
  handler: async (ctx, args) => {
    const blog = await ctx.db.get("blogs", args.blogId);

    if (blog === null) {
      return null;
    }

    const resolvedImageUrl =
      blog?.imageStorageId !== undefined
        ? await ctx.storage.getUrl(blog.imageStorageId)
        : null;

    return {
      ...blog,
      imageUrl: resolvedImageUrl,
    };
  },
});

type SearchResult = {
  _id: string;
  title: string;
  content: string;
};

export const searchBlogs = query({
  args: {
    term: v.string(),
    limit: v.number(),
  },
  handler: async (ctx, args) => {
    const limit = args.limit;

    const results: SearchResult[] = [];

    const seen = new Set();

    const pushDocs = async (docs: Array<Doc<"blogs">>) => {
      for (const doc of docs) {
        if (seen.has(doc._id)) continue;

        seen.add(doc._id);
        results.push({
          _id: doc._id,
          title: doc.title,
          content: doc.content,
        });

        if (results.length >= limit) break;
      }
    };

    const titlelMaches = await ctx.db
      .query("blogs")
      .withSearchIndex("search_title", (q) => q.search("title", args.term))
      .take(limit);

    await pushDocs(titlelMaches);

    if (results.length < limit) {
      const contentMatches = await ctx.db
        .query("blogs")
        .withSearchIndex("search_content", (q) =>
          q.search("content", args.term),
        )
        .take(limit);

      await pushDocs(contentMatches);
    }

    return results;
  },
});
