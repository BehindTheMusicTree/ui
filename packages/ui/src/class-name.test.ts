import { describe, expect, it } from "vitest";
import { cn } from "./class-name";

describe("cn", () => {
  it("lets a later type role replace an earlier one", () => {
    expect(cn("text-body", "text-title")).toBe("text-title");
  });

  it("keeps a type role next to a text color", () => {
    expect(cn("text-input", "text-[var(--color-text)]")).toBe("text-input text-[var(--color-text)]");
  });

  it("still merges built-in font sizes", () => {
    expect(cn("text-sm", "text-lg")).toBe("text-lg");
  });
});
