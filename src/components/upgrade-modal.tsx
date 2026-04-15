"use client";

import { useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createCheckout } from "@/app/actions/create-checkout";
import { Loader2, Sparkles } from "lucide-react";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpgradeModal({ open, onOpenChange }: UpgradeModalProps) {
  const [isPending, startTransition] = useTransition();

  const handleUpgrade = () => {
    startTransition(async () => {
      const result = await createCheckout();
      if (result.url) {
        window.location.href = result.url;
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            Upgrade to PRO
          </DialogTitle>
          <DialogDescription>
            You&apos;ve used all 3 free posts. Upgrade to PRO for unlimited AI
            content generation.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-primary">✓</span> Unlimited post generation
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-primary">✓</span> All platforms supported
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-primary">✓</span> Priority support
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Maybe later
          </Button>
          <Button onClick={handleUpgrade} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="animate-spin" />
                Redirecting...
              </>
            ) : (
              "Upgrade Now"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
