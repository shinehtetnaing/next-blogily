import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchQuery } from "convex/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { api } from "../../../../convex/_generated/api";

export const dynamic = "force-static";
export const revalidate = 30;

export default async function BlogPage() {
  return (
    <div className="py-8">
      <div className="space-y-5 text-center">
        <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Our Blog
        </h2>
        <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
          Insights, thoughts, and trends from our team.
        </p>
      </div>

      <Suspense fallback={<SkeletonBlogCard />}>
        <LoadBlogs />
      </Suspense>
    </div>
  );
}

async function LoadBlogs() {
  const blogs = await fetchQuery(api.blog.getBlogs);

  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {blogs?.map((blog) => (
        <Card key={blog._id} className="overflow-hidden pt-0">
          <div className="relative h-64 w-full sm:h-72">
            <Image
              src={
                blog.imageUrl ??
                "https://images.unsplash.com/photo-1765873360315-b253774254eb?q=80&w=1175&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              }
              alt={blog.title}
              fill
              className="object-cover"
            />
          </div>
          <CardContent>
            <h3 className="mb-4 text-2xl font-semibold">{blog.title}</h3>
            <p className="text-muted-foreground line-clamp-3">{blog.content}</p>
          </CardContent>
          <CardFooter className="mt-auto">
            <Link
              href={`/blogs/${blog._id}`}
              className={buttonVariants({ className: "w-full" })}
            >
              Read more
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

function SkeletonBlogCard() {
  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="flex flex-col space-y-6">
          <Skeleton className="h-48 w-full rounded-xl" />
          <div className="flex flex-col space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
