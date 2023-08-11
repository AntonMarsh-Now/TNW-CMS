"use client";
import BlogCardPreview from "@/components/BlogCardPreview";
import { CreateBlogButton } from "@/components/CreateBlogButton";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchBlogs, limitText } from "@/lib/functions";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

export default function BlogPage() {
  const supabase = createClientComponentClient();

  const dummy = Array(5).fill(0);

  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    fetchBlogs(supabase).then((blogs) => {
      setBlogs(blogs as Blog[]);
      setLoading(false);
    });
  }, []);

  return (
    <div className="container py-10 h-fit flex flex-row space-x-10">
      <div className="w-full">
        <div className="flex flex-row items-center justify-between">
          <div className="text-2xl">Blogs</div>
          <CreateBlogButton />
        </div>
        <div className="mt-10 grid grid-cols-6 gap-5">
          {loading ? (
            <>
              {dummy.map((_, i) => {
                return (
                  <div
                    key={i}
                    className="flex flex-col items-center border p-3 rounded-lg space-y-3 hover:cursor-pointer w-fit"
                  >
                    <Skeleton className="relative h-40 w-40 rounded-lg overflow-hidden"></Skeleton>
                    <Skeleton className="w-40 h-10"></Skeleton>
                  </div>
                );
              })}
            </>
          ) : (
            <>
              {blogs.map((blog) => {
                return (
                  <BlogCardPreview
                    key={blog.id}
                    image={blog.blog_bg}
                    title={blog.title}
                    description={limitText(blog.blog_content, 50)}
                    href={`/account/blogs/${blog.id}`}
                  />
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}