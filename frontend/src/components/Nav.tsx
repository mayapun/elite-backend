"use client";

import { usePathname, useRouter } from "next/navigation";
import { clearToken } from "@/lib/auth";

export default function Nav() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        clearToken();
        router.push("/auth");
    }

    if (pathname === "/auth") return null;
    if (pathname === "/feed"){
    return (
        <nav className="flex gap-2">
            {pathname === "/feed" ? (
                <button onClick={handleLogout} className="px-4 py-2 rounded-xl bg-[#65646F] text-white text-sm" >
                    Logout
                </button>
            ):(
                <a href="/feed" className="px-4 py-2 rounded-xl bg-[#65656F] text-white text-sm"> Feed</a>
            )}
        </nav>
    )
}
}