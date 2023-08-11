"use client";

import { CreatePromotionButton } from "@/components/CreatePromotionButton";
import PromotionPreviewCard from "@/components/PromotionPreviewCard";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchPromotions } from "@/lib/functions";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

export default function PromotionsPage() {
  const supabase = createClientComponentClient();

  const dummy = Array(5).fill(0);

  const [loading, setLoading] = useState(true);
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  useEffect(() => {
    fetchPromotions(supabase).then((data) => {
      setPromotions(data as Promotion[]);
      setLoading(false);
    });

    const promotions = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "promotions" },
        (payload) => {
          fetchPromotions(supabase).then((data) => {
            setPromotions(data as Promotion[]);
          });
        }
      )
      .subscribe();

    return () => {
      promotions.unsubscribe();
    };
  }, []);

  return (
    <div className="container py-10 h-fit flex flex-row space-x-10">
      <div className="w-full">
        <div className="flex flex-row items-center justify-between">
          <div className="text-2xl">Promotions</div>
          <CreatePromotionButton />
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
              {promotions.map((consultant) => {
                return (
                  <PromotionPreviewCard
                    key={consultant.id}
                    id={consultant.id}
                    title={consultant.title}
                    image={consultant.image}
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
