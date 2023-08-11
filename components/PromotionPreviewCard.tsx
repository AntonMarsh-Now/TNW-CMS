"use client";

import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deletePromotion, updatePromotion } from "@/lib/functions";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { FC, useState } from "react";
import { useToast } from "./ui/use-toast";

interface PromotionPreviewCardProps extends Promotion {}

const PromotionPreviewCard: FC<PromotionPreviewCardProps> = (props) => {
  const { toast } = useToast();
  const supabase = createClientComponentClient();
  const [name, setName] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      setLoading(true);
      await updatePromotion(
        supabase,
        props.id,
        name,
        image!,
        toast,
        props.image
      );
      setLoading(false);
      setName("");
    } catch (error) {
      console.error(error);
    }
  }

  async function onDelete() {
    try {
      setLoading(true);
      await deletePromotion(supabase, props.id, toast, props.image);
      setLoading(false);
      setName("");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          onClick={() => {
            setName(props.title);
          }}
          className="flex flex-col items-center w-full border rounded-lg p-3 space-y-3 hover:cursor-pointer"
        >
          <div className="relative h-40 w-full overflow-hidden rounded-lg">
            <Image src={props.image} alt="" fill objectFit="cover" />
          </div>
          <div className="max-w-[160px] text-center">{props.title}</div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit promotion</DialogTitle>
          <DialogDescription>
            Enter the promotion title and pick an image for the promotion.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] ?? null)}
            />
          </div>
        </div>

        <div className="flex flex-row items-center justify-between space-x-5">
          <Button
            onClick={onDelete}
            disabled={loading}
            className="w-full"
            variant="destructive"
          >
            {loading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Delete promotion
          </Button>
          <Button onClick={onSubmit} disabled={loading} className="w-full">
            {loading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Edit promotion
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PromotionPreviewCard;
