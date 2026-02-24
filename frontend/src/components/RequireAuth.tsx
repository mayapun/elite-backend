"use client"; 

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthed } from "@/lib/auth";

export default function RequireAuth({ children}: {children: React.ReactNode}){
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        if (!isAuthed()) {
            router.replace("/auth");
    }else{
        setIsChecking(false);
    }
    }, [router]);
    if (isChecking) return null;
    return <> {children}</>;
}