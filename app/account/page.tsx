"use client";



import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
export default function Dashboard() {
  const supabase = createClientComponentClient();

  
  return (


    <div className="container mt-5 ml-20">
      <meta http-equiv="refresh" content="0; url='/account/blogs'" />
      <div >Welcome</div>
    </div>
  );
}




