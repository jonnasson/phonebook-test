import { useEffect, useRef, useState } from "react";
import { useLazyQuery } from "@apollo/client/react";
import type { DocumentNode } from "@apollo/client";

export type DebouncedQueryStatus = "idle" | "checking" | "hit" | "miss";

interface UseDebouncedQueryOptions<TData, TVars> {
  query: DocumentNode;
  variables: () => TVars | null;
  pickResult: (data: TData) => boolean;
  deps: unknown[];
  delay?: number;
}

export function useDebouncedQuery<TData, TVars>({
  query,
  variables,
  pickResult,
  deps,
  delay = 350,
}: UseDebouncedQueryOptions<TData, TVars>) {
  const [status, setStatus] = useState<DebouncedQueryStatus>("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const abortRef = useRef(false);
  const [execQuery] = useLazyQuery<TData>(query, { fetchPolicy: "network-only" });

  useEffect(() => {
    setStatus("idle");
    clearTimeout(debounceRef.current);
    abortRef.current = false;

    const vars = variables();
    if (vars === null) return;

    debounceRef.current = setTimeout(() => {
      if (abortRef.current) return;
      setStatus("checking");
      execQuery({ variables: vars as Record<string, unknown> })
        .then(({ data }) => {
          if (abortRef.current) return;
          setStatus(data && pickResult(data) ? "hit" : "miss");
        })
        .catch(() => {
          if (!abortRef.current) setStatus("idle");
        });
    }, delay);

    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  const reset = () => {
    abortRef.current = true;
    clearTimeout(debounceRef.current);
    setStatus("idle");
  };

  const resume = () => {
    abortRef.current = false;
  };

  return { status, reset, resume };
}
