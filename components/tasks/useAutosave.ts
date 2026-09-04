"use client";

import { useEffect, useState } from "react";
import { saveDraftAction } from "@/lib/actions/submissions";
import type { SubmissionContent } from "@/lib/domain/types";

export function useAutosave(content: SubmissionContent, enabled: boolean) {
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      setSaving(true);
      const result = await saveDraftAction(content);
      if (cancelled) return;
      setSaving(false);
      if (result.ok && result.savedAt) setSavedAt(result.savedAt);
    }, 1200);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(content), enabled]);

  return { savedAt, saving };
}
