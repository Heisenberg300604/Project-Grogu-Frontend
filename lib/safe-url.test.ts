import { describe, expect, it } from "vitest";

import { safeHttpUrl } from "@/lib/safe-url";

describe("safeHttpUrl", () => {
  it("accepts http and https links", () => {
    expect(safeHttpUrl("https://example.com/a")).toBe("https://example.com/a");
    expect(safeHttpUrl("http://example.com")).toBe("http://example.com/");
  });

  it("trims surrounding whitespace", () => {
    expect(safeHttpUrl("  https://example.com  ")).toBe("https://example.com/");
  });

  it("rejects script and data URLs", () => {
    expect(safeHttpUrl("javascript:alert(1)")).toBeUndefined();
    expect(safeHttpUrl("data:text/html,<script>alert(1)</script>")).toBeUndefined();
    expect(safeHttpUrl("  JavaScript:alert(1)")).toBeUndefined();
  });

  it("rejects relative, malformed and empty values", () => {
    expect(safeHttpUrl("example.com")).toBeUndefined();
    expect(safeHttpUrl("")).toBeUndefined();
    expect(safeHttpUrl(undefined)).toBeUndefined();
    expect(safeHttpUrl(null)).toBeUndefined();
  });
});
