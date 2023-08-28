"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBlog, createConsultant } from "@/lib/functions";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icons } from "./Icons";
import { useToast } from "./ui/use-toast";

export function CreateBlogButton() {
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [name, setName] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      setLoading(true);
      const id = await createBlog(supabase, name, image!, toast);

      if (id) {
        router.push(`/account/blogs/${id}`);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button onClick={() => {}} variant="outline">
          New Article
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new Article</DialogTitle>
          <DialogDescription>
            Enter the Article title and pick an image for the Article.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-right">
              Image
            </Label>
            <Input
              type="file"
              id="image"
              className="col-span-3"
              required
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] ?? null)}
            />
          </div>

          <DialogFooter>
            <Button disabled={loading} type="submit">
              {loading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Article
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
