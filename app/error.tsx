"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-sm uppercase tracking-[0.2em] text-rose-600">Terjadi kendala</p>
      <h1 className="text-4xl font-semibold tracking-tight text-slate-950">Halaman gagal dimuat</h1>
      <p className="text-sm leading-7 text-slate-600">
        Error boundary App Router sudah aktif. Silakan coba render ulang segmen ini.
      </p>
      <Button onClick={reset}>Coba Lagi</Button>
    </div>
  );
}
