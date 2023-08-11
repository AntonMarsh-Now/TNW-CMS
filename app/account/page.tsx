"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function Dashboard() {
  const supabase = createClientComponentClient();

  return (
    <div className="container">
      <div>hey</div>
    </div>
  );
}
