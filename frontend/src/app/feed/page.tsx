// src/app/feed/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import RequireAuth from "@/components/RequireAuth";
import { api } from "@/lib/api";

type Post = {
  id: number;
  content: string;
  user_id?: number;
  created_at?: string;
};

type PaginatedPosts = {
  items: Post[];
  next_cursor: number | null;
};

export default function FeedPage() {
  const [items, setItems] = useState<Post[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"desc" | "asc">("desc");
  const [error, setError] = useState<string | null>(null);

  // Build query string from state
  const baseQuery = useMemo(() => {
    const params = new URLSearchParams();
    params.set("limit", "10");
    params.set("sort", sort);
    if (search.trim()) params.set("search", search.trim());
    return `/posts?${params.toString()}`;
  }, [search, sort]);

  async function loadInitial() {
    setError(null);
    setLoading(true);
    try {
      const res = await api<PaginatedPosts>(baseQuery, { auth: true });
      setItems(res.items);
      setNextCursor(res.next_cursor);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load feed");
    } finally {
      setLoading(false);
    }
  }

  async function loadMore() {
    if (nextCursor === null) return;
    setLoadingMore(true);
    setError(null);
    try {
      const params = new URLSearchParams(baseQuery.split("?")[1] ?? "");
      params.set("cursor", String(nextCursor));
      const res = await api<PaginatedPosts>(`/posts?${params.toString()}`, { auth: true });

      setItems((prev) => [...prev, ...res.items]);
      setNextCursor(res.next_cursor);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load more");
    } finally {
      setLoadingMore(false);
    }
  }

  // Debounce search/sort changes
  useEffect(() => {
    const t = setTimeout(() => loadInitial(), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseQuery]);

return (
  <RequireAuth>
    <div className="fixed inset-0 overflow-hidden">
      <div className="absolute inset-5 bg-cover bg-center" style={{ backgroundImage: "url('/bg.webp')" }}>
      </div>
      <div className="absolute inset-0 bg-amber-100/20"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-4/5 max-w-5xl bg-white backdrop-blur-md rounded-[40px] shadow-2xl p-12">
        Day 1 Layout Shell</div>
      </div>

    </div>
  </RequireAuth>
);
}
