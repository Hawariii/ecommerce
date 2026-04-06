"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";

import { toggleWishlistAction } from "@/app/actions/wishlist";
import { Button } from "@/components/ui/button";

export function WishlistButton({ productId }: { productId: string }) {
  const [isPending, startTransition] = useTransition();
  const [isSaved, setIsSaved] = useState(false);

  return (
    <Button
      type="button"
      size="icon"
      variant="secondary"
      className="rounded-2xl"
      onClick={() =>
        startTransition(async () => {
          const result = await toggleWishlistAction(productId);
          if (result?.status === "added") setIsSaved(true);
          if (result?.status === "removed") setIsSaved(false);
        })
      }
      disabled={isPending}
      aria-label="Tambahkan ke wishlist"
    >
      <Heart className={`h-4 w-4 ${isSaved ? "fill-rose-500 text-rose-500" : "text-slate-600"}`} />
    </Button>
  );
}
