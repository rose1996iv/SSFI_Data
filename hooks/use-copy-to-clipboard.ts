"use client";

import { useState } from "react";

export function useCopyToClipboard() {
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(value: string, key = value) {
    await navigator.clipboard.writeText(value);
    setCopied(key);
    window.setTimeout(() => setCopied(null), 1500);
  }

  return { copied, copy };
}
