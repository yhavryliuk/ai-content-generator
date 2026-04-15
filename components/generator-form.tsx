"use client";

import { useState, useTransition, useRef, useOptimistic } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import { UpgradeModal } from "@/components/upgrade-modal";
import { validateGeneration } from "@/app/actions/generate-post";
import { Loader2, Briefcase, MessageCircle } from "lucide-react";
import { GeneratedContent } from "./generated-content";

interface GeneratorFormProps {
  used: number;
  limit: number;
  plan: "FREE" | "PRO";
}

export function GeneratorForm({ used, limit, plan }: GeneratorFormProps) {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState(["LinkedIn"]);
  const [output, setOutput] = useState("");
  const [isGenerationPending, startGenerationTransition] = useTransition();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [optimisticCurrentUsed, setOptimisticCurrentUsed] = useOptimistic(used);
  const abortRef = useRef<AbortController | null>(null);

  const isFreePlan = plan === "FREE";
  const isProPlan = plan === "PRO";

  const handleGenerate = () => {
    if (!topic.trim()) return;

    startGenerationTransition(async () => {
      const validation = await validateGeneration();

      if (!validation.canGenerate) {
        if (validation.error === "upgrade_required") {
          setShowUpgrade(true);
        }
        return;
      }

      setOutput("");
      abortRef.current = new AbortController();

      try {
        setOptimisticCurrentUsed((prev) => prev + 1);
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic, platform: platform[0] }),
          signal: abortRef.current.signal,
        });

        if (!response.ok) {
          const data = await response.json();
          if (data.error === "upgrade_required") {
            setShowUpgrade(true);
            return;
          }
          throw new Error(data.error || "Generation failed");
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) throw new Error("No response body");

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = decoder.decode(value, { stream: true });
          setOutput((prev) => prev + text);
        }

        router.refresh();
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        console.error("Generation error:", err);
      }
    });
  };

  return (
    <>
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Create Content</h2>
          {isFreePlan && (
            <Badge variant="outline">
              {optimisticCurrentUsed}/{limit} posts used
            </Badge>
          )}
          {isProPlan && <Badge>PRO — Unlimited</Badge>}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>What do you want to write about?</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Textarea
              placeholder="Enter your topic... e.g., 'The future of AI in healthcare'"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              rows={3}
            />

            <div className="flex items-center justify-between">
              <ToggleGroup
                value={platform}
                onValueChange={(val) => val.length > 0 && setPlatform(val.slice(-1))}
              >
                <ToggleGroupItem value="LinkedIn" aria-label="LinkedIn">
                  <Briefcase />
                  LinkedIn
                </ToggleGroupItem>
                <ToggleGroupItem value="Twitter" aria-label="Twitter">
                  <MessageCircle />
                  Twitter
                </ToggleGroupItem>
              </ToggleGroup>

              <Button
                onClick={handleGenerate}
                disabled={isGenerationPending || !topic.trim()}
              >
                {isGenerationPending ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {output && (
          <GeneratedContent output={output} />
        )}
      </div>

      <UpgradeModal open={showUpgrade} onOpenChange={setShowUpgrade} />
    </>
  );
}
