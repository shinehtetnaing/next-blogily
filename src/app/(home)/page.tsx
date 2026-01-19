import { Button } from "@/components/ui/button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | Next.js 16 Tutorial",
  description: "This is your home page.",
  category: "Web development",
  authors: [{ name: "Shine" }],
};

export default function Home() {
  return <Button>Click Me</Button>;
}
