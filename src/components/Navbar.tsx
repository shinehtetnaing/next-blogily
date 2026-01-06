import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { buttonVariants } from "./ui/button";

const Navbar = () => {
  return (
    <nav className="flex items-center gap-5 py-5 lg:py-8">
      <Link href="/">
        <h1 className="text-3xl font-bold">
          Next<span className="text-green-300">Blogily</span>
        </h1>
      </Link>
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className={buttonVariants({ variant: "ghost" })}>
            Home
          </Link>
          <Link href="/blogs" className={buttonVariants({ variant: "ghost" })}>
            Blogs
          </Link>
          <Link href="/create" className={buttonVariants({ variant: "ghost" })}>
            Create
          </Link>
        </div>
        <div className="flex items-center gap-5">
          <Link href="/auth/login" className={buttonVariants()}>
            Login
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
