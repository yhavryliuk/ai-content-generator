"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { MarkdownContent } from "@/components/markdown-content";
import { useCallback, useState } from "react";

interface GeneratedContentProps {
	output: string;
}

export function GeneratedContent({ output }: GeneratedContentProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = useCallback(async () => {
		await navigator.clipboard.writeText(output);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}, [output]);

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle>Generated Content</CardTitle>
					<Button variant="ghost" size="sm" onClick={handleCopy}>
						{copied ? (
							<>
								<Check />
								Copied
							</>
						) : (
							<>
								<Copy />
								Copy
							</>
						)}
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<MarkdownContent content={output} />
			</CardContent>
		</Card>
	);
}