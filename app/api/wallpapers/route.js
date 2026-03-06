import { NextResponse } from "next/server";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "minimalism";
    const page = searchParams.get("page") || "1";

    try {
        const url = `https://wallhaven.cc/api/v1/search?q=${encodeURIComponent(query)}&categories=111&purity=100&sorting=random&order=desc&page=${page}`;

        const response = await fetch(url, {
            headers: {
                "User-Agent": "WallpaperApp/1.0",
            },
            next: { revalidate: 60 }, // cache for 60s
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: `Wallhaven API error: ${response.status}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Wallpaper fetch error:", error);
        return NextResponse.json(
            { error: "Failed to fetch wallpapers" },
            { status: 500 }
        );
    }
}
