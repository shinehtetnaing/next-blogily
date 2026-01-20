import BlogPresence from "@/components/BlogPresence";
import CommentSection from "@/components/CommentSection";
import { buttonVariants } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { fetchAuthQuery } from "@/lib/auth-server";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { Preloaded } from "convex/react";
import { FunctionReturnType } from "convex/server";
import { Annoyed, ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { redirect } from "next/navigation";

type GetBlogResult = FunctionReturnType<typeof api.blog.getBlogById>;
type GetCommentResult = Preloaded<typeof api.comment.getCommentsByBlogId>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ blogId: Id<"blogs"> }>;
}): Promise<Metadata> {
  const { blogId } = await params;
  const blog = await fetchQuery(api.blog.getBlogById, { blogId });

  if (!blog) {
    return {
      title: "Blog not found",
    };
  }

  return {
    title: blog.title,
    description: blog.content,
  };
}

export default async function BlogDetails({
  params,
}: {
  params: Promise<{ blogId: Id<"blogs"> }>;
}) {
  const { blogId } = await params;

  let blog: GetBlogResult | null = null;
  let preloadedComments: GetCommentResult | null = null;
  let userId = null;
  try {
    [blog, preloadedComments, userId] = await Promise.all([
      await fetchQuery(api.blog.getBlogById, { blogId }),
      await preloadQuery(api.comment.getCommentsByBlogId, {
        blogId,
      }),
      await fetchAuthQuery(api.presence.getUserId),
    ]);

    console.log(userId);
  } catch (error) {
    console.log(error);
    return <EmptyBlog />;
  }

  if (!userId) {
    return redirect("/auth/login");
  }

  if (!blog) {
    return <EmptyBlog />;
  }

  return (
    <div className="animate-in fade-in relative mx-auto max-w-3xl py-8 duration-500">
      <Link
        href="/blogs"
        className={buttonVariants({ variant: "outline", className: "mb-5" })}
      >
        <ArrowLeft className="size-4" />
        Back to blogs
      </Link>

      <div className="relative mb-8 h-100 w-full overflow-hidden rounded-xl shadow-sm">
        <Image
          src={
            blog.imageUrl ??
            "https://images.unsplash.com/photo-1765873360315-b253774254eb?q=80&w=1175&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          alt={blog.title}
          loading="eager"
          fill
          className="object-contain transition-transform duration-500 hover:scale-105"
        />
      </div>

      <div className="flex flex-col space-y-5">
        <h2 className="text-foreground text-4xl font-bold tracking-tight">
          {blog.title}
        </h2>

        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground text-sm">
            Posted on:{" "}
            {new Date(blog._creationTime).toLocaleDateString("en-US")}
          </span>
          {userId && <BlogPresence roomId={blog._id} userId={userId} />}
        </div>
      </div>

      <Separator className="my-8" />

      <p className="text-foreground/90 text-lg leading-relaxed whitespace-pre-wrap">
        {blog.content}
      </p>

      <Separator className="my-8" />

      <CommentSection preloadedComments={preloadedComments} />
    </div>
  );
}

function EmptyBlog() {
  return (
    <div className="flex min-h-[calc(100dvh-7rem)] items-center">
      <Empty>
        <EmptyHeader className="max-w-md">
          <EmptyMedia variant="icon">
            <Annoyed />
          </EmptyMedia>
          <EmptyTitle className="text-2xl capitalize">
            404 - blog not found
          </EmptyTitle>
          <EmptyDescription className="text-xl/relaxed">
            The blog you&apos;re looking for doesn&apos;t exist or may have been
            removed. You can head back to the blogs page to discover others.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link href="/blogs" className={buttonVariants()}>
            Back to blogs
          </Link>
        </EmptyContent>
      </Empty>
    </div>
  );
}
