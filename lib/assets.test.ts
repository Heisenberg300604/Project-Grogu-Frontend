import { afterEach, describe, expect, it, vi } from "vitest";

import { assetUrl } from "@/lib/assets";

describe("assetUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("resolves uploaded files against the API", () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://api.example.com/");
    expect(assetUrl("/uploads/abc123.png")).toBe(
      "https://api.example.com/uploads/abc123.png",
    );
  });

  it("passes https links through unchanged", () => {
    expect(assetUrl("https://cdn.example.com/a.png")).toBe(
      "https://cdn.example.com/a.png",
    );
  });

  it("refuses script, data and plain http URLs", () => {
    expect(assetUrl("javascript:alert(1)")).toBeUndefined();
    expect(assetUrl("data:image/png;base64,AAAA")).toBeUndefined();
    expect(assetUrl("http://cdn.example.com/a.png")).toBeUndefined();
  });

  it("refuses paths outside /uploads and traversal attempts", () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://api.example.com");
    expect(assetUrl("/etc/passwd")).toBeUndefined();
    expect(assetUrl("/uploads/../secret")).toBeUndefined();
    expect(assetUrl("/uploads/a/b.png")).toBeUndefined();
  });

  it("returns undefined for empty values", () => {
    expect(assetUrl(undefined)).toBeUndefined();
    expect(assetUrl(null)).toBeUndefined();
    expect(assetUrl("")).toBeUndefined();
  });
});
