import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_ENTRIES, SEARCH } from "../graphql/queries";

export type Entry = { id: string; name: string; phone: string };

export function usePhoneBookEntries(term: string) {
  const trimmed = term.trim();

  // Debounce the search term by 300ms
  const [debouncedTerm, setDebouncedTerm] = useState(trimmed);
  useEffect(() => {
    const id = setTimeout(() => setDebouncedTerm(trimmed), 300);
    return () => clearTimeout(id);
  }, [trimmed]);

  // Always fetch full list (used for empty-state checks & cache updates)
  const { data: allData, loading: allLoading } = useQuery<{
    entries: Entry[];
  }>(GET_ENTRIES);

  // Server-side search when there's a term
  const { data: searchData, loading: searchLoading } = useQuery<{
    search: Entry[];
  }>(SEARCH, {
    variables: { term: debouncedTerm },
    skip: !debouncedTerm,
  });

  const allEntries = allData?.entries ?? [];

  const lastSearchRef = useRef<Entry[] | null>(null);

  useEffect(() => {
    if (searchData?.search) {
      lastSearchRef.current = searchData.search;
    }
  }, [searchData]);

  useEffect(() => {
    if (!debouncedTerm) {
      lastSearchRef.current = null;
    }
  }, [debouncedTerm]);

  const isSearching = trimmed !== debouncedTerm || searchLoading;

  // Reading ref during render is intentional — shows stale results while new search loads
  /* eslint-disable react-hooks/refs */
  const filteredEntries = !debouncedTerm
    ? allEntries
    : (searchData?.search ?? lastSearchRef.current ?? allEntries);
  /* eslint-enable react-hooks/refs */

  const loading = allLoading;

  const groupedData = useMemo(() => {
    const groups: string[] = [];
    const groupCounts: number[] = [];
    let currentLetter = "";

    for (const entry of filteredEntries) {
      const letter = entry.name[0]?.toUpperCase() ?? "";
      if (letter !== currentLetter) {
        groups.push(letter);
        groupCounts.push(1);
        currentLetter = letter;
      } else {
        groupCounts[groupCounts.length - 1]++;
      }
    }

    return { groups, groupCounts };
  }, [filteredEntries]);

  return {
    allEntries,
    filteredEntries,
    groupedData,
    loading,
    isSearching,
    deferredTerm: debouncedTerm,
  };
}
