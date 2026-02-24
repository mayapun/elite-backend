import type {Metadata} from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
    title: "Maya Journal",
    description: "A calm journal feed backed by your API",
};

export default function RootLayout({ children} : {children: React.ReactNode}){
    return (
        <html lang="en">
            <body>
                <AppShell>
                <div className="bg-[#f4f1ec] rounded-3xl shadow-xl p-12 h-full flex flex-col min-h-0">
                    {/* Header is shared acorss all pages */}
                    <header className="flex items-center justify-between mb-6">
                        <div className="flex flex-col">
                            <div className="text-xl font-semibold tracking-tight">Maya Journal</div>
                            <div className="text-sm muted">soft thoughts, saved gently</div>
                        </div>
                        {/* Simple navigation links */}
                        <Nav />
                    </header>

                    {/* This renders the current page */}
                    {children}
                    <footer className="mt-10 text-xs muted">
                        built with queit focus
                    </footer>
                </div>
                </AppShell>
            </body>
        </html>
    );
}