// src/app/feed/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import { api } from "@/lib/api";
import PostComposer from "@/components/PostComposer";
import { formatDate } from "@/lib/date";

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
  const [newPost, setNewPost] = useState("")
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null)

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

  async function handleSubmit(){
    if (!newPost.trim()) return ;

    try {
      const res = await api<Post>("/posts", {
        method: "POST",
        body: JSON.stringify({ content: newPost}),
        auth: true,
      });

      if (sort == "desc"){
        setItems((prev) => [res, ...prev]);
      }else{
        setItems((prev) => [...prev, res])
      }
      setNewPost("");
    }catch (e) {
      console.error("Failed to create post", e);
    }
  }

  async function handleDelete(id: number){
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await api(`/posts/${id}`, {
        method: "DELETE",
        body: undefined,
        auth: true
      });
      setItems((prev) => prev.filter((p) =>p.id !== id))
    }catch (err) {
      console.error("Failed to delete post", err);
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
  <div className="flex flex-col gap-10 flex-1 min-h-0">
  {/* HEADER */}
  <div className="text-center">
    <h1 className="text-3xl font-semibold tracking-wide">
      Maya's Journal
    </h1>
    <p className="text-sm text-neutral-500 mt-2">
      soft thoughts, saved gently
    </p>
  </div>

  {/* MAIN GRID */}
  <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-10 flex-1 min-h-0">

    {/* LEFT — Composer */}
    <div className="bg-neutral-200 rounded-2xl p-6 flex flex-col min-h-0">
      <PostComposer
        variant="full"
        onSuccess={(newPost) => {
          if (sort === "desc"){
            setItems((prev) => [newPost, ...prev]);
          }else{
            setItems((prev) => [...prev, newPost]);
          }
        }}
        />
    </div>

    {/* RIGHT — Feed Placeholder */}
    <div className="flex flex-col min-h-0">
      <div className="flex gap-3 mb-4">
        <input value = {search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="flex-1 bg-neutral-200 rounded-xl px-4 py-2 text-sm outline-none" />
        <select value={sort} onChange={(e) => setSort(e.target.value as "asc" | "desc")} className="bg-neutral-200 rounded-xl px-4 py-2 text-sm outline-none">
          <option value="desc">Newest</option>
          <option value="asc">Oldest</option>
        </select>
      </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {items.map((p) => (
          <div key={p.id} className="group relative bg-neutral-200 rounded-xl p-4 whitespace-pre-wrap break-words">
            {/* ACTIONS (hidden until hover) */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <button onClick={() => setEditingPost(p)} className="text-xs text-[#65646F]">
                Edit
              </button>

              <button onClick={() => handleDelete(p.id)}className="text-xs px-2 py-1 rounded-md bg-red-300 hover:bg-red-400">
                Delete
              </button>
            </div>
            {editingPost?.id === p.id ? (
              <PostComposer
              initialContent={p.content}
              postId={p.id}
              createdAt={p.created_at}
              onCancel={() => setEditingPost(null)}
              onSuccess={(updatedPost) => {
                setEditingPost(null)
                setItems(prev =>
                  prev.map(item => 
                    item.id === updatedPost.id ? updatedPost : item
                  )
                )
              }
            }
            // onCancel={() => setEditingPost(null)}
            />): (
            <div className="space-y-2">
                <div className="text-[11px] uppercase tracking-wide text-neutral-400">
                  {formatDate(p.created_at)}
                </div>
                <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                  <div className={expanded === p.id ? "" : "line-clamp-6"}>
                  {p.content}
                  </div>
                  {p.content.length > 200 && (
                    <button
                      onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                      className="text-xs text-[#65646F] mt-2"
                    >
                      {expanded === p.id ? "Show less" : "Read more"}
                    </button>
                  )}
                </div>
              </div>            )}
          </div>
        ))}
                {/* LOAD MORE */}
        { nextCursor !== null && (
          <div className="flex justify-center pt-2">
          <button
          onClick={loadMore}
          disabled={loadingMore}
          className="px-6 py-2 rounded-xl bg-neutral-300 text-sm diabled:opacity-40"
          >
            {loadingMore ? "Loading...": "Load More"}
          </button>
          </div>
        )}
        {nextCursor === null && items.length > 0 && (
          <div className="text-center text-xs text-neutral-400 pt-2">
            You've reached the end!
          </div>
        )}
        </div>
    </div>

  </div>
</div>
  </RequireAuth>
);
}
