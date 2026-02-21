import type {Metadata} from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Maya Journal",
    description: "A calm journal feed backed by your API",
};

export default function RootLayout({ children} : {children: React.ReactNode}){
    return (
        <html lang="en">
            <body>
                <div className="container-narrow">
                    {/* Header is shared acorss all pages */}
                    <header className="flex items-center justify-between mb-6">
                        <div className="flex flex-col">
                            <div className="text-xl font-semibold tracking-tight">Maya Journal</div>
                            <div className="text-sm muted">soft thoughts, saved gently</div>
                        </div>
                        {/* Simple navigation links */}
                        <nav className="flex gap-2">
                            <a href="/feed" className="btn">Feed</a>
                            <a href="/auth" className="btm">Auth</a>
                        </nav>
                    </header>

                    {/* This renders the current page */}
                    {children}
                    <footer className="mt-10 text-xs muted">
                        built with queit focus
                    </footer>
                </div>
            </body>
        </html>
    );
}