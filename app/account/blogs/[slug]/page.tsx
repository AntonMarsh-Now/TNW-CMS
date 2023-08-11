"use client";

import { Icons } from "@/components/Icons";
import BlogPreview from "@/components/previews/BlogPreview";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  checkIfImageIsBig,
  deleteBlog,
  fetchBlogFromId,
  getUrlForSelectedImage,
  getUrlForSelectedImages,
  updateBlog,
} from "@/lib/functions";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BlogEdit({ params }: { params: { slug: string } }) {
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [blog, setBlog] = useState<Blog>({} as Blog);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [blogTitle, setBlogTitle] = useState<string | undefined>();
  const [blogAuthor, setBlogAuthor] = useState<string | undefined>();
  const [blogCategory, setBlogCategory] = useState<string | undefined>();
  const [blogContent, setBlogContent] = useState<string | undefined>();
  const [images, setImages] = useState<string[] | undefined>();
  const [blogBg, setBlogBg] = useState<string | undefined>();
  const [relatedBlogs, setRelatedBlogs] = useState<string[] | undefined>();

  const [imageFile, setImageFile] = useState<File | undefined>();
  const [galleryImageFiles, setGalleryImageFiles] = useState<File[] | undefined>();
  const [oldImages, setOldImages] = useState<string[] | undefined>();

  useEffect(() => {
    fetchBlogFromId(params.slug, supabase).then((data) => {
      setBlog(data as Blog);

      setBlogTitle(data!.title);
      setBlogAuthor(data!.author);
      setBlogCategory(data!.category);
      setBlogContent(data!.blog_content);
      setImages(data!.images as string[]);
      setBlogBg(data!.blog_bg);

      setOldImages([...data!.images!, data!.blog_bg]);
    });
  }, []);

  return (
    <div className="container py-10 min-h-screen flex flex-row space-x-5">
      <div className="w-[40%] h-screen overflow-y-auto p-1 no-scrollbar">
        <div className="flex flex-row items-center justify-between">
          <Button
            disabled={buttonLoading}
            onClick={async () => {
              setButtonLoading(true);

              const blog: Blog = {
                id: params.slug,
                title: blogTitle!,
                author: blogAuthor!,
                category: blogCategory!,
                blog_content: blogContent!,
                images: images!,
                blog_bg: blogBg!,
              };

              await updateBlog(
                blog,
                supabase,
                imageFile!,
                galleryImageFiles!,
                toast,
                oldImages!
              );

              setButtonLoading(false);
            }}
            variant="outline"
          >
            {buttonLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save Changes
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">
                <Trash size={16} className="text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this blog and remove all data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    setDeleteLoading(true);
                    await deleteBlog(supabase, blog!, toast);
                    router.push("/account/blogs");
                  }}
                >
                  {deleteLoading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Delete Blog
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="flex flex-col mt-10 space-y-5">
          <form className="flex flex-col space-y-5">
            <div className="grid gap-3">
              <Label htmlFor="blogBg">Blog Background Image</Label>
              {imageFile && checkIfImageIsBig(imageFile) && (
                <Label className="text-xs text-destructive" htmlFor="blogBg">
                  Image is quite big. This may affect performance.
                </Label>
              )}
              <Input
                id="blogBg"
                type="file"
                disabled={isLoading}
                accept="image/*"
                onChange={async (event) => {
                  const fileUrl = getUrlForSelectedImage(event);
                  setBlogBg(fileUrl);
                  setImageFile(event.target.files![0]);
                }}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="consultantImage">Blog Gallery</Label>
              <Input
                id="consultantImage"
                type="file"
                disabled={isLoading}
                accept="image/*"
                multiple
                onChange={(event) => {
                  const files = event.target.files!;
                  if (files.length > 3) {
                    toast({
                      title: "Error",
                      description: "You can only upload 3 images.",
                      variant: "destructive",
                    });
                    return;
                  } else {
                    const fileUrls = getUrlForSelectedImages(event);
                    setImages([]);
                    setGalleryImageFiles([]);
                    setImages(fileUrls);
                    setGalleryImageFiles(Array.from(files));
                  }
                }}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="blogTitle">Blog Title</Label>
              <Input
                id="blogTitle"
                placeholder="Las Vegas"
                type="text"
                disabled={isLoading}
                defaultValue={blog?.title}
                value={blogTitle}
                onChange={(event) => setBlogTitle(event.target.value)}
              />
            </div>
            <Separator />
            <div className="grid gap-3">
              <Label htmlFor="blogAuthor">Blog Author</Label>
              <Input
                id="blogAuthor"
                placeholder="Jane Doe"
                type="text"
                disabled={isLoading}
                defaultValue={blog?.author}
                value={blogAuthor}
                onChange={(event) => setBlogAuthor(event.target.value)}
              />
            </div>
            <Separator />
            <div className="grid gap-3">
              <Label htmlFor="blogCategory">Blog Category</Label>
              <Input
                id="blogCategory"
                placeholder="Our Blog"
                type="text"
                disabled={isLoading}
                defaultValue={blog?.category}
                value={blogCategory}
                onChange={(event) => setBlogCategory(event.target.value)}
              />
            </div>
            <Separator />
            <div className="grid gap-3">
              <Label htmlFor="blogContent">Blog Content</Label>
              <Textarea
                id="blogContent"
                placeholder="Expose your business to the world"
                disabled={isLoading}
                defaultValue={blog?.blog_content}
                value={blogContent}
                onChange={(event) => setBlogContent(event.target.value)}
              />
            </div>
            {/* <div className="grid gap-3">
              <Label htmlFor="blogContent">Related Blogs</Label>
              <RelatedBlogsPicker
                values={relatedBlogs! || []}
                setValues={setRelatedBlogs}
              />
            </div> */}
          </form>
        </div>
      </div>
      <div className="w-full bg-previewBg rounded-xl overflow-hidden h-screen overflow-y-auto no-scrollbar">
        <BlogPreview
          id=""
          title={blogTitle!}
          images={images}
          author={blogAuthor!}
          blog_content={blogContent!}
          category={blogCategory!}
          defaultImages={[]}
          blog_bg={blogBg!}
        />
      </div>
    </div>
  );
}
