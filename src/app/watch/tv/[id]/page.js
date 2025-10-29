// src/app/watch/tv/[id]/page.js

// ----------------------------------------------------------------------
// 1. SERVER-ONLY IMPORTS & FUNCTIONS
// ----------------------------------------------------------------------
import axios from "axios";
import { TVShowClientComponent } from "./TvShowClientComponent";
import { Metadata } from 'next'; 

// FIX: Modified server list. Base URLs should not include '/tv' if the client component appends the ID/Season/Episode directly after.
const servers = [
    // Adjusted URLs to exclude '/tv' to prevent double slashes or malformed paths.
    { id: 1, name: "Server 1 - Premium", quality: "1080p", ping: 45, status: "online", location: "US East", flag: "🇺🇸", type: "premium", speed: "Ultra Fast", baseUrl: "https://vidsrc.me/embed" }, 
    { id: 2, name: "Server 2 - Standard", quality: "720p", ping: 67, status: "online", location: "US West", flag: "🇺🇸", type: "standard", speed: "Fast", baseUrl: "https://embed.su/embed" }, 
    { id: 3, name: "Server 3 - Premium", quality: "1080p", ping: 52, status: "online", location: "EU Central", flag: "🇪🇺", type: "premium", speed: "Ultra Fast", baseUrl: "https://putlocker.vip/embed" }, 
    { id: 4, name: "Server 4 - Basic", quality: "720p", ping: 73, status: "online", location: "Asia", flag: "🌏", type: "basic", speed: "Medium", baseUrl: "https://vidsrc.icu/embed" }, 
    { id: 5, name: "Server 5 - Ultra", quality: "4K", ping: 38, status: "online", location: "UK", flag: "🇬🇧", type: "ultra", speed: "Lightning", baseUrl: "https://vidlink.pro" }, 
];

// Reusable data fetching function
async function getTVShowData(id) {
    try {
        const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/tv/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API}`,
        );
        return res.data;
    } catch (error) {
        console.error("Error fetching TV show data:", error);
        return null;
    }
}

// ----------------------------------------------------------------------
// 2. DYNAMIC METADATA FUNCTION (Force Dynamic Rendering)
// ----------------------------------------------------------------------
export async function generateMetadata({ params }) {
    const { id } = params;
    const tvShow = await getTVShowData(id);

    if (!tvShow) {
        return {
            title: 'TV Show Not Found',
            description: 'The requested TV show could not be found.',
        };
    }

    return {
        title: `${tvShow.name} - Watch Series Online`,
        description: tvShow.overview,
        keywords: tvShow.genres?.map(g => g.name).join(', ') || tvShow.name,
        openGraph: {
            title: tvShow.name,
            description: tvShow.overview,
            images: [`https://image.tmdb.org/t/p/w1280${tvShow.backdrop_path}`],
            type: 'video.tv_show',
        },
    };
}

// ----------------------------------------------------------------------
// 3. MAIN SERVER COMPONENT
// ----------------------------------------------------------------------
// This component fetches the initial data and passes it to the Client Component.
export default async function ServerTVPage({ params }) {
    
    // Explicitly destructure 'id' for clean use
    const { id } = params; 

    // Fetch data using the destructured 'id'
    const tvShow = await getTVShowData(id);

    if (!tvShow) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <h1 className="text-white text-2xl">TV Show not found. Please check the ID.</h1>
            </div>
        );
    }
    
    // Pass the initial server-fetched data and path parameters to the client component
    return <TVShowClientComponent initialTvShowData={tvShow} params={params} servers={servers} />;
}