"use client";

import { Icons } from "@/components/Icons";
import TestimonialCardPreview from "@/components/TestimonialCardPreview";
import { TestimonialDatePicker } from "@/components/TestimonialDatePic";
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
  deleteTestimonial,
  fetchTestimonialFromId,
  getUrlForSelectedImage,
  updateTestimonial,
} from "@/lib/functions";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { format } from "date-fns";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TestimonialEditor({
  params,
}: {
  params: { slug: string };
}) {
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [testimonial, setTestimonial] = useState<Testimonial>(
    {} as Testimonial
  );

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [selectedImageFile, setSelectedImageFile] = useState<
    File | undefined
  >();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | undefined>();

  useEffect(() => {
    fetchTestimonialFromId(params.slug, supabase).then((data) => {
      setTestimonial(data as Testimonial);
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

              const testimonialTemp: Testimonial = {
                ...testimonial,
                date: selectedDate
                  ? format(selectedDate, "PPP")
                  : testimonial.date,
              };

              await updateTestimonial(
                supabase,
                testimonialTemp,
                selectedImageFile!,
                toast
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
                  this testimonial and remove all data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    setDeleteLoading(true);
                    await deleteTestimonial(supabase, testimonial, toast);
                    router.push("/account/testimonials");
                  }}
                >
                  {deleteLoading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Delete Testimonial
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="flex flex-col mt-10 space-y-5">
          <form className="flex flex-col space-y-5">
            <div className="grid gap-3">
              <Label htmlFor="testBg">User Image</Label>
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

                  setSelectedImageFile(event.target.files![0]);
                }}
              />
            </div>
            <Separator />
            <div className="grid gap-3">
              <Label htmlFor="blogTitle">Testimonial Title</Label>
              <Input
                id="blogTitle"
                placeholder="Las Vegas"
                type="text"
                disabled={isLoading}
                value={testimonial.title}
                onChange={(event) => {
                  setTestimonial({
                    ...testimonial,
                    title: event.target.value,
                  });
                }}
              />
            </div>
            <Separator />
            <div className="grid gap-3">
              <Label htmlFor="blogAuthor">Testimonial Author</Label>
              <Input
                id="blogAuthor"
                placeholder="Jane Doe"
                type="text"
                disabled={isLoading}
                value={testimonial.author}
                onChange={(event) => {
                  setTestimonial({
                    ...testimonial,
                    author: event.target.value,
                  });
                }}
              />
            </div>
            <Separator />
            <div className="grid gap-3">
              <Label htmlFor="blogCategory">Testimonial Content</Label>
              <Textarea
                id="blogCategory"
                placeholder="Something really cool about this trip."
                disabled={isLoading}
                value={testimonial.testimonial}
                onChange={(event) => {
                  setTestimonial({
                    ...testimonial,
                    testimonial: event.target.value,
                  });
                }}
              />
            </div>
            <Separator />
            <div className="grid gap-3">
              <Label htmlFor="blogContent">Testimonial Date</Label>
              <TestimonialDatePicker
                date={selectedDate}
                setDate={setSelectedDate}
              />
            </div>
          </form>
        </div>
      </div>
      <div className="w-fit p-4 bg-previewBg h-fit rounded-xl overflow-hidden overflow-y-auto no-scrollbar">
        <TestimonialCardPreview
          {...testimonial}
          user_image={
            selectedImageFile
              ? URL.createObjectURL(selectedImageFile)
              : testimonial.user_image
          }
          date={selectedDate ? format(selectedDate, "PPP") : testimonial.date}
        />
      </div>
    </div>
  );
}
