import {API_BASE_URL} from "./config";
import { getToken } from "./auth";

type FetchOptions = RequestInit & { auth?: boolean};

export async function api<T>(path:string, options: FetchOptions = {}): Promise<T>{
    const url = `${API_BASE_URL}${path}`;

    const headers = new Headers(options.headers);

    if (!headers.has("Content-Type") && options.body){
        headers.set("Content-Type", "application/json");
    }

    if (options.auth){
        const token = getToken();
        if (token) headers.set("Authorization", `Bearer ${token}`)
    }

    const res = await fetch(url, {
        ...options,
        headers,
        cache: "no-store",
    });

    const text = await res.text();
    const data = text ? safeJson(text) : null;

    if (!res.ok){
        const message = 
        (data && (data.detail || data.message)) || `${res.status} ${res.statusText}`;
        throw new Error(message);
    }

    return (data ?? ({} as T)) as T;
}

function safeJson(text: string){
    try {
        return JSON.parse(text);
    }catch {
        return null;
    }
}
