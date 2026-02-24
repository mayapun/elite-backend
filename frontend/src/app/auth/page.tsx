"use client";

import {useMemo, useState} from "react";
import {useRouter} from "next/navigation";
import {motion} from "framer-motion";
import {api} from "@/lib/api";
import {setToken} from "@/lib/auth";

type Mode = "login" | "signup";

export default function AuthPage() {
    const router = useRouter(); 
    const [mode, setMode] = useState<Mode>("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const title = useMemo(
        () => (mode === "login" ? "Welcome back" : "Create your space"),
        [mode]
    );

    async function onSubmit(e: React.FormEvent){
        e.preventDefault();
        setError(null);
        setBusy(true);

        try {
        
            if (mode === "signup"){
                await api("/users/signup", {
                    method: "POST",
                    body: JSON.stringify({ email, password}),
                });
            }

            const res = await api <{access_token: string; token_type?:string}>(
                "/users/login",
                {
                    method: "POST", 
                    body: JSON.stringify({ email, password})
                }
            );

            setToken(res.access_token);

            router.replace("/feed");
        }
        catch (err:any) {
            setError(err?.message ?? "Something went wrong");
        }finally {
            setBusy(false);
        }
    }

    return (
        <div className="flex flex-1 items-center justify-center">
        <motion.div
        initial={{ opacity:0, y:10}}
        animate={{ opacity:1, y:0}}
        className="w-full max-w-xl bg-neutral-100 rounded-2xl p-8 shadow-md"
        >
            <div className="flex items-center justify-between mb-4">
                <div>
                    <div className="text-2xl font-semibold">{title}</div>
                    <div className="text-sm text-neutral-500 mt-1">
                        A clam place to write, reflect, and keep your days.
                    </div>
                </div>

                {/* Mode toggle */}
                <div className="flex gap-2">
                    <button
                    className={`btn ${mode === "login" ? "btn-primary" : ""}`}
                    onClick={()=> setMode("login")} type="button">
                        Login
                    </button>
                    <button className={`btn ${mode === "signup" ? "btn-primary" : ""}`}
                    onClick={() => setMode("signup")} 
                    type="button">
                    Signup
                </button>
                </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-3">
                <div>
                    <label className="text-sm muted">Email</label>
                    <input className="input mt-1" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div><label className="text-sm muted">Password</label>
                <input className="input mt-1" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <div className="text-xs muted mt-1">Tip: keep it at least 6 characters.</div>
                </div>

                {error ? (
                    <div className="text-sm" style={{color: "rgb(154 70 70)"}}>
                        {error}
                    </div>
                ): null}
                <button className="btn btn-primary w-full" disabled={busy}>
                    {busy ? "Breathing..." : mode === "login" ? "Enter" : "Create + Enter"}
                </button>
            </form>
        </motion.div>
        </div>
    )
}
