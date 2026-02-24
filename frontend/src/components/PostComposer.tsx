"use client"

import { useState } from "react"
import { Post } from "@/types/post"
import { api } from "@/lib/api"
import { formatDate } from "@/lib/date"

type Props = {
    initialContent?: string;
    postId?: number;
    createdAt?: string;
    variant? : "full" | "compact"
    onSuccess: (post: Post) => void;
    onCancel?: () => void;
}

export default function PostComposer({
    initialContent = "",
    postId,
    createdAt,
    variant= "compact",
    onSuccess,
    onCancel
}: Props){
    const [content, setContent] = useState(initialContent)
    const [loading, setLoading] = useState(false)
    const isFull = variant === "full"
    const containerClass = isFull 
    ? "flex flex-col flex-1"
    : "bg-neutral-200 rounded-xl p-4 space-y-3"

    async function handleSubmit() {
        if (!content.trim()) return

        setLoading(true)

        const token = localStorage.getItem("token")

        const endpoint = postId
        ? `/posts/${postId}`
        : `/posts`

        const method = postId ? "PUT" : "POST"

        const res = await api<Post>(endpoint, {
            method,
            auth: true,
            body: JSON.stringify({ content}),
        });

        setContent("")
        setLoading(false)
        onSuccess(res)
    }

    return (
        <div className={containerClass}>
            <div className="text-center mb-6">
                <p className="text-xs uppercase tracking-widest text-neutral-400">
                    {createdAt ? "Originally Published" : "Today"}
                    </p>
                    <p className="text-lg font-medium" >
                    {createdAt? formatDate(createdAt) : new Date().toLocaleDateString(undefined,{
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                    })}
                </p>
            </div>
            {/* TEXTAREA */}
            <textarea rows={isFull? undefined : 3} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write Something..." className={`${isFull ? "flex-1" : ""} bg-transparent resize-none outline-none text-sm`}></textarea>

{/* BUTTONS */}
            <div className="flex justify-between items-center mt-4">
                    {postId && onCancel && (
                        <button 
                        onClick={onCancel} className="text-xs uppercase tracking-wide text-neutral-400 hover:text-neutral-700 transition">
                            Cancel
                        </button>
                    )}
                    <button onClick={handleSubmit} disabled={loading ||!content.trim()} className="px-5 py-2 rounded-xl bg-[#65646F] text-white text-sm disabled:opacity-40">
                        {loading ? "Saving...": postId ? "Update" : "Post"}
                    </button>
            </div>

        </div>
    )
}
