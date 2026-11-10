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

  it("lets a plain spacing class replace the panel spacing keys", () => {
    expect(cn("px-panel-x gap-panel-gap", "px-4 gap-2")).toBe("px-4 gap-2");
    expect(cn("-mx-panel-x", "mx-0")).toBe("mx-0");
  });
});
