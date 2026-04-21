"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreateRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace("/requests");
  }, [router]);

  return null;
}
