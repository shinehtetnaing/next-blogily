import { useQuery } from "convex/react";
import { Loader2, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
import { Input } from "./ui/input";

const SearchInput = () => {
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);

  const results = useQuery(
    api.blog.searchBlogs,
    term.length >= 2 ? { term, limit: 5 } : "skip",
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(e.target.value);
    setOpen(true);
  };

  return (
    <div className="relative w-full max-w-sm">
      <div className="relative">
        <Search className="text-muted-foreground absolute top-2.5 left-2.5 size-4" />
        <Input
          type="search"
          placeholder="Search blogs..."
          className="bg-background w-full pl-8"
          value={term}
          onChange={handleChange}
        />
      </div>

      {open && term.length >= 2 && (
        <div className="bg-popover text-popover-foreground animate-in fade-in-0 zoom-in-95 absolute top-full z-10 mt-2 rounded-md border shadow-md outline-none">
          {results === undefined ? (
            <div className="text-muted-foreground flex items-center justify-center p-4 text-sm">
              <Loader2 className="mr-2 size-4 animate-spin" />
              Searching ...
            </div>
          ) : results.length === 0 ? (
            <p className="text-muted-foreground p-4 text-center text-sm">
              No results found
            </p>
          ) : (
            <div className="max-h-60 overflow-y-auto">
              {results.map((blog) => (
                <Link
                  href={`/blogs/${blog._id}`}
                  key={blog._id}
                  className="hover:bg-accent hover:text-accent-foreground flex cursor-pointer flex-col space-y-1 px-4 py-2 text-sm"
                  onClick={() => {
                    setOpen(false);
                    setTerm("");
                  }}
                >
                  <h6 className="truncate font-medium">{blog.title}</h6>
                  <p className="text-muted-foreground text-xs">
                    {blog.content.substring(0, 60)}...
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
