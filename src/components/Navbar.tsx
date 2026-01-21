"use client";

import { authClient } from "@/lib/auth-client";
import { useConvexAuth } from "convex/react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { Button, buttonVariants } from "./ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import SearchInput from "./SearchInput";

const Navbar = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();

  return (
    <header className="flex items-center gap-5 py-5 lg:py-8">
      <Link href="/">
        <h1 className="text-3xl font-bold">
          Next<span className="text-green-300">Blogily</span>
        </h1>
      </Link>
      <div className="flex w-full items-center justify-between">
        <nav className="flex items-center gap-3">
          <Link href="/" className={buttonVariants({ variant: "ghost" })}>
            Home
          </Link>
          <Link href="/blogs" className={buttonVariants({ variant: "ghost" })}>
            Blogs
          </Link>
          <Link href="/create" className={buttonVariants({ variant: "ghost" })}>
            Create
          </Link>
        </nav>
        <div className="flex items-center gap-5">
          <div className="hidden md:block">
            <SearchInput />
          </div>
          {isLoading ? null : isAuthenticated ? (
            <Button
              onClick={() =>
                authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      toast.success("Logged out successfully");
                      router.push("/");
                    },
                    onError: (error) => {
                      toast.error(`Logout failed: ${error.error.message}`);
                    },
                  },
                })
              }
            >
              Logout
            </Button>
          ) : (
            <Link href="/auth/login" className={buttonVariants()}>
              Login
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
