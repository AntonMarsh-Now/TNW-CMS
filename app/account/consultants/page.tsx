"use client";
import ConsultantPreviewCard from "@/components/ConsultantPreviewCard";
import { CreateConsultantButton } from "@/components/CreateConsultantButton";
import { Skeleton } from "@/components/ui/skeleton";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ConsultantsPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const dummy = Array(5).fill(0);

  const [loading, setLoading] = useState(true);
  const [consultantData, setConsultantData] = useState<Consultant[]>([]);

  const fetchConsultantFields = async () => {
    try {
      const { data, error } = await supabase.from("consultants").select("*");

      if (error) throw error;

      return data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchConsultantFields().then((data) => {
      setConsultantData(data as Consultant[]);
      setLoading(false);
    });
  }, []);

  return (
    <div className="container py-10 h-fit flex flex-row space-x-10">
      <div className="w-full">
        <div className="flex flex-row items-center justify-between">
          <div className="text-2xl">Consultants</div>
          <CreateConsultantButton />
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
              {consultantData.map((consultant) => {
                return (
                  <ConsultantPreviewCard
                    key={consultant.id}
                    consultant={consultant}
                    href={`/account/consultants/${consultant.id}`}
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
