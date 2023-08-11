"use client";

import { Icons } from "@/components/Icons";
import { ConsultantPreview } from "@/components/previews/ConsultantPreview";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  checkIfImageIsBig,
  deleteConsultant,
  fetchConsultantFromId,
  getUrlForSelectedImage,
  updateConsultant,
} from "@/lib/functions";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { ChevronDown, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ConsultantEdit({
  params,
}: {
  params: { slug: string };
}) {
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [consultant, setConsultant] = useState<Consultant>();
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const [oldImages, setOldImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [consultantName, setConsultantName] = useState<string | undefined>();
  const [consultantRole, setConsultantRole] = useState<string | undefined>();
  const [consultantSpecialities, setConsultantSpecialities] = useState<
    string[] | undefined
  >();

  const [consultantEmail, setConsultantEmail] = useState<string | undefined>();
  const [consultantPhone, setConsultantPhone] = useState<string | undefined>();
  const [consultantLocation, setConsultantLocation] = useState<
    string | undefined
  >();

  const [consultantTopReviewContent, setConsultantTopReviewContent] = useState<
    string | undefined
  >();

  const [consultantTopReviewBy, setConsultantTopReviewBy] = useState<
    string | undefined
  >();

  const [consultantAbout, setConsultantAbout] = useState<string | undefined>();
  const [consultantImage, setConsultantImage] = useState<string | undefined>();
  const [consultantBackgroundImage, setConsultantBackgroundImage] = useState<
    string | undefined
  >();
  const [consultantSecondayImage, setConsultantSecondaryImage] = useState<
    string | undefined
  >();

  const [imageFile, setImageFile] = useState<File | undefined>();
  const [backgroundImageFile, setBackgroundImageFile] = useState<
    File | undefined
  >();
  const [secondaryImageFile, setSecondaryImageFile] = useState<
    File | undefined
  >();

  useEffect(() => {
    fetchConsultantFromId(params.slug, supabase).then((data) => {
      setConsultant(data as Consultant);

      setConsultantName(data!.name);
      setConsultantRole(data!.role);
      setConsultantSpecialities(data!.specialities);
      setConsultantEmail(data!.email);
      setConsultantPhone(data!.phone);
      setConsultantLocation(data!.location);
      setConsultantTopReviewContent(data!.top_review.content);
      setConsultantTopReviewBy(data!.top_review.by);
      setConsultantAbout(data!.about);
      setOldImages([
        data!.image,
        data!.background_image,
        data!.secondary_image,
      ]);
    });
  }, []);

  return (
    <div
      className="container py-10 min-h-screen flex flex-row space-x-5"
      suppressHydrationWarning
    >
      <div className="w-[40%] h-screen overflow-y-auto p-1 no-scrollbar">
        <div className="flex flex-row items-center justify-between">
          <Button
            disabled={buttonLoading}
            onClick={async () => {
              setButtonLoading(true);

              const consultant: Consultant = {
                id: params.slug,
                name: consultantName!,
                role: consultantRole!,
                specialities: consultantSpecialities!,
                email: consultantEmail!,
                phone: consultantPhone!,
                location: consultantLocation!,
                top_review: {
                  content: consultantTopReviewContent!,
                  by: consultantTopReviewBy!,
                },
                about: consultantAbout!,
                image: consultantImage!,
                background_image: consultantBackgroundImage!,
                secondary_image: consultantSecondayImage!,
              };

              let shouldUpdateImages = false;

              if (
                consultant.image !== consultant?.image ||
                consultant.background_image !== consultant?.background_image ||
                consultant.secondary_image !== consultant?.secondary_image
              ) {
                shouldUpdateImages = true;
              }

              await updateConsultant(
                consultant,
                supabase,
                imageFile!,
                backgroundImageFile!,
                secondaryImageFile!,
                toast,
                shouldUpdateImages,
                oldImages
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
                  this consultant and remove all data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    setDeleteLoading(true);
                    await deleteConsultant(supabase, consultant!, toast);
                    router.push("/account/consultants");
                  }}
                >
                  {deleteLoading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Delete Consultant
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="flex flex-col mt-10 space-y-5">
          <form className="flex flex-col space-y-5">
            <div className="grid gap-3">
              <Label htmlFor="consultantImage">Consultant Image</Label>
              {imageFile && checkIfImageIsBig(imageFile) && (
                <Label
                  className="text-xs text-destructive"
                  htmlFor="consultantBackgroundImage"
                >
                  Image is quite big. This may affect performance.
                </Label>
              )}
              <Input
                id="consultantImage"
                type="file"
                disabled={isLoading}
                accept="image/*"
                onChange={async (event) => {
                  const fileUrl = await getUrlForSelectedImage(event);
                  setConsultantImage(fileUrl);
                  setImageFile(event.target.files![0]);
                }}
              />
            </div>
            <Separator />

            <div className="grid gap-3">
              <Label htmlFor="consultantBackgroundImage">
                Consultant Background Image
              </Label>
              {backgroundImageFile &&
                checkIfImageIsBig(backgroundImageFile) && (
                  <Label
                    className="text-xs text-destructive"
                    htmlFor="consultantBackgroundImage"
                  >
                    Image is quite big. This may affect performance.
                  </Label>
                )}
              <Input
                id="consultantBackgroundImage"
                type="file"
                disabled={isLoading}
                accept="image/*"
                onChange={async (event) => {
                  const fileUrl = await getUrlForSelectedImage(event);
                  setConsultantBackgroundImage(fileUrl);
                  setBackgroundImageFile(event.target.files![0]);
                }}
              />
            </div>
            <Separator />
            <div className="grid gap-3">
              <Label htmlFor="consultantName">Consultant Name</Label>
              <Input
                id="consultantName"
                placeholder="Jane Doe"
                type="text"
                disabled={isLoading}
                defaultValue={consultant?.name}
                value={consultantName}
                onChange={(event) => setConsultantName(event.target.value)}
              />
            </div>
            <Separator />
            <div className="grid gap-3">
              <Label htmlFor="consultantRole">Consultant Role</Label>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-between"
                  >
                    <div>{consultantRole ? consultantRole : "Select Role"}</div>
                    <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[300px]">
                  <DropdownMenuItem
                    onClick={() => setConsultantRole("Administator")}
                  >
                    Administator
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setConsultantRole("Leisure Advisor")}
                  >
                    Leisure Advisor
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setConsultantRole("Corporate Advisor")}
                  >
                    Corporate Advisor
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Separator />
            <div className="grid gap-3">
              <Label htmlFor="consultantEmail">Consultant Email</Label>
              <Input
                id="consultantEmail"
                placeholder="jane@gmail.com"
                type="email"
                disabled={isLoading}
                defaultValue={consultant?.email}
                value={consultantEmail}
                onChange={(event) => setConsultantEmail(event.target.value)}
              />
            </div>
            <Separator />
            <div className="grid gap-3">
              <Label htmlFor="consultantPhone">Consultant Phone Number</Label>
              <Input
                id="consultantPhone"
                placeholder="+1 123 456 7890"
                type="text"
                disabled={isLoading}
                defaultValue={consultant?.phone}
                value={consultantPhone}
                onChange={(event) => setConsultantPhone(event.target.value)}
              />
            </div>
            <Separator />
            <div className="grid gap-3">
              <Label htmlFor="consultantLocation">Consultant Location</Label>
              <Input
                id="consultantLocation"
                placeholder="New York, NY"
                type="text"
                disabled={isLoading}
                defaultValue={consultant?.location}
                value={consultantLocation}
                onChange={(event) => setConsultantLocation(event.target.value)}
              />
            </div>
            <Separator />
            <div className="grid gap-3">
              <Label htmlFor="consultantAbout">Consultant About</Label>
              <Textarea
                id="consultantAbout"
                placeholder="Very experienced consultant with over 10 years of experience in the tourism industry."
                disabled={isLoading}
                defaultValue={consultant?.about}
                value={consultantAbout}
                onChange={(event) => setConsultantAbout(event.target.value)}
              />
            </div>
            <Separator />
            <div className="grid gap-3">
              <Label htmlFor="consultantSpecialities">
                Consultant Specialities
              </Label>
              <Textarea
                id="consultantSpecialities"
                placeholder="Tourism, Leisure, Hospitality"
                disabled={isLoading}
                defaultValue={consultant?.specialities}
                value={consultantSpecialities}
                onChange={(event) =>
                  setConsultantSpecialities(event.target.value.split(","))
                }
              />
            </div>

            <Separator />
            <div className="grid gap-3">
              <Label htmlFor="consultantSecondayImage">
                Consultant Secondary Image
              </Label>
              {secondaryImageFile && checkIfImageIsBig(secondaryImageFile) && (
                <Label
                  className="text-xs text-destructive"
                  htmlFor="consultantBackgroundImage"
                >
                  Image is quite big. This may affect performance.
                </Label>
              )}
              <Input
                id="consultantSecondayImage"
                type="file"
                disabled={isLoading}
                accept="image/*"
                onChange={async (event) => {
                  const fileUrl = await getUrlForSelectedImage(event);
                  setConsultantSecondaryImage(fileUrl);
                  setSecondaryImageFile(event.target.files![0]);
                }}
              />
            </div>
            <Separator />
            <div className="grid gap-3">
              <Label htmlFor="consultantName">Consultant Top Review</Label>
              <Input
                className="w-fit"
                id="consultantTopReviewBy"
                placeholder="John Doe"
                type="text"
                disabled={isLoading}
                defaultValue={consultant?.top_review.by}
                value={consultantTopReviewBy}
                onChange={(event) =>
                  setConsultantTopReviewBy(event.target.value)
                }
              />
              <Textarea
                placeholder="The best consultant i've ever worked with!"
                defaultValue={consultant?.top_review.content}
                value={consultantTopReviewContent}
                disabled={isLoading}
                onChange={(event) =>
                  setConsultantTopReviewContent(event.target.value)
                }
              />
            </div>
          </form>
        </div>
      </div>
      <div className="w-full bg-previewBg rounded-xl overflow-hidden h-screen overflow-y-auto no-scrollbar">
        <ConsultantPreview
          id=""
          name={consultantName!}
          role={consultantRole!}
          specialities={consultantSpecialities || []}
          email={consultantEmail!}
          phone={consultantPhone!}
          location={consultantLocation!}
          top_review={{
            content: consultantTopReviewContent!,
            by: consultantTopReviewBy!,
          }}
          about={consultantAbout!}
          image={consultantImage!}
          background_image={consultantBackgroundImage!}
          secondary_image={consultantSecondayImage!}
          defaultSecondaryImage={consultant?.secondary_image!}
          defaultBackgroundImage={consultant?.background_image!}
          defaultImage={consultant?.image!}
        />
      </div>
    </div>
  );
}
