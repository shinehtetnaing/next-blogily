"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { blogSchema } from "@/lib/schemas/blog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

export default function CreatePage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const onSubmit = (data: z.infer<typeof blogSchema>) => {
    startTransition(async () => {
      console.log(data);
    });
  };

  return (
    <div className="w-full py-8">
      <div className="space-y-5 text-center">
        <h2 className="text-4xl font-extrabold">Share your thoughts</h2>
        <p className="text-muted-foreground text-xl">
          Write your blog post here.
        </p>
      </div>

      <Card className="mx-auto mt-8 w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Blog</CardTitle>
          <CardDescription>Enter your blog details below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-y-6">
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="title">Title</FieldLabel>
                    <Input
                      id="title"
                      placeholder="Your awesome blog title"
                      {...field}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="content"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="content">Content</FieldLabel>
                    <Textarea
                      id="content"
                      placeholder="Super cool blog content"
                      className="h-40"
                      {...field}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Field>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader className="size-4 animate-spin" />{" "}
                      <span>Loading...</span>
                    </>
                  ) : (
                    <span>Create Blog</span>
                  )}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
