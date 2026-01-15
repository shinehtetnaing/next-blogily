"use client";

import { commentSchema } from "@/lib/schemas/comment";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
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

const CommentSection = () => {
  const params = useParams<{ blogId: Id<"blogs"> }>();
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
        <h2 className="text-lg font-semibold">Comments</h2>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};

export default CommentSection;
