"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function Dashboard() {
  const supabase = createClientComponentClient();

  return (
    <div className="container mt-5 ml-20">
      <div >Welcome</div>
    </div>
  );
}
