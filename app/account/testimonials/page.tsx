"use client";

import { CreateConsultantButton } from "@/components/CreateConsultantButton";
import { CreateTestimonialButton } from "@/components/CreateTestimonialButton";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchTestimonials } from "@/lib/functions";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TestimonialsPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const dummy = Array(5).fill(0);

  const [loading, setLoading] = useState(true);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    fetchTestimonials(supabase).then((testimonials) => {
      setTestimonials(testimonials as Testimonial[]);
      setLoading(false);
    });
  }, []);

  return (
    <div className="container py-10 h-fit flex flex-row space-x-10 ">
      <div className="w-full">
        <div className="flex flex-row items-center justify-between">
          <div className="text-2xl">Testimonials</div>
          <CreateTestimonialButton />
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
              {testimonials.map((testimonial) => {
                return (
                  <Link
                    href={`/account/testimonials/${testimonial.id}`}
                    key={testimonial.id}
                    className="border p-3 rounded-lg flex w-full flex-col items-center space-y-4 hover:cursor-pointer"
                  >
                    <div className="relative h-40 w-full overflow-hidden rounded-lg">
                      <Image
                        src={testimonial.user_image}
                        fill
                        alt=""
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className="font-bold text-lg">{testimonial.title}</div>
                    <div>{testimonial.author}</div>
                  </Link>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
