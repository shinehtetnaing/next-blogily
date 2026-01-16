"use client";

import { commentSchema } from "@/lib/schemas/comment";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { Loader, MessageSquare } from "lucide-react";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";

const CommentSection = () => {
  const params = useParams<{ blogId: Id<"blogs"> }>();
  const comments = useQuery(api.comment.getCommentsByBlogId, {
    blogId: params.blogId,
  });
  const [isPending, startTransition] = useTransition();
  const crerateComment = useMutation(api.comment.createComment);
  const form = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      body: "",
      blogId: params.blogId,
    },
  });

  const onSubmit = (data: z.infer<typeof commentSchema>) => {
    startTransition(async () => {
      try {
        await crerateComment(data);
        form.reset();

        toast.success("Comment posted");
      } catch (error) {
        const errorMessage =
          error instanceof ConvexError ? (error.data as string) : error;
        toast.error(`Failed to create comment: ${errorMessage}`);
      }
    });
  };

  return (
    <Card>
      <CardHeader className="flex items-center gap-3 border-b">
        <MessageSquare className="size-5" />
        <h2 className="text-lg font-semibold">{comments?.length} Comments</h2>
      </CardHeader>
      <CardContent className="space-y-8">
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            name="body"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="body">Your Comment</FieldLabel>
                <Textarea
                  id="body"
                  placeholder="Share your thoughts..."
                  {...field}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />

          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader className="size-4 animate-spin" />{" "}
                <span>Loading...</span>
              </>
            ) : (
              <span>Submit</span>
            )}
          </Button>
        </form>

        {comments !== undefined && comments.length > 0 && (
          <>
            <Separator />
            <section className="space-y-6">
              {comments?.map((comment) => (
                <div key={comment._id} className="flex gap-4">
                  <Avatar className="size-10 shrink-0">
                    <AvatarImage
                      src={`https://avatar.vercel.sh/${comment.authorName}`}
                      alt={comment.authorName}
                    />
                    <AvatarFallback>
                      {comment.authorName.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">
                        {comment.authorName}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {new Date(comment._creationTime).toLocaleDateString(
                          "en-US",
                        )}
                      </p>
                    </div>

                    <p className="text-foreground/90 text-sm leading-relaxed whitespace-pre-wrap">
                      {comment.body}
                    </p>
                  </div>
                </div>
              ))}
            </section>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CommentSection;
