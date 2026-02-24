"use client"

import { ReactNode } from "react"

export default function AppShell({ children}: {children:ReactNode}){
    return (
        <div className="h-screen relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-cover bg-center -z-10" style={{backgroundImage: "url(/bg.webp)"}}/>
            <div className="absolute inset-0 bg-amber-100/20 -z-10"></div>
            {/* Content */}
            <div className="relative z-10 h-full flex flex-col px-6 py-16 min-h-0">
                {children}
            </div>
        </div>
    )
}