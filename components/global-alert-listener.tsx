"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Alert from "@/components/custom-alert";

function AlertListener() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [alert, setAlert] = useState<{
    type: "success" | "error" | "warning" | "info";
    title?: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    const message = searchParams.get("message");
    const type =
      (searchParams.get("type") as "success" | "error" | "warning" | "info") ||
      "success";

    if (message) {
      // Use setTimeout to avoid setting state synchronously during render/effect
      setTimeout(() => {
        setAlert({
          type,
          title: type === "error" ? "Error" : "Success",
          message,
        });
      }, 0);

      // Remove the message param from the URL
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("message");
      newSearchParams.delete("type");

      const newUrl = `${pathname}${newSearchParams.toString() ? `?${newSearchParams.toString()}` : ""}`;
      // Use replace to update URL without adding to history
      router.replace(newUrl);
    }
  }, [searchParams, pathname, router]);

  if (!alert) return null;

  return (
    <Alert
      type={alert.type}
      title={alert.title}
      message={alert.message}
      onClose={() => setAlert(null)}
    />
  );
}

export default function GlobalAlertListener() {
  return (
    <Suspense fallback={null}>
      <AlertListener />
    </Suspense>
  );
}
