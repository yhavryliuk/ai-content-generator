import { describe, expect, it } from "vitest";

import { cn } from "../src/shared/lib/utils";

describe("cn", () => {
  it("merges tailwind classes keeping the last conflicting utility", () => {
    expect(cn("px-2", "px-4", "text-sm")).toBe("px-4 text-sm");
  });

  it("handles conditional and falsy values", () => {
    expect(cn("font-medium", false && "hidden", undefined, "text-xs")).toBe(
      "font-medium text-xs"
    );
  });
});
