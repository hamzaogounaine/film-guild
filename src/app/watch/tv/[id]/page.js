// src/app/watch/tv/[id]/page.js

// ----------------------------------------------------------------------
// 1. SERVER-ONLY IMPORTS & FUNCTIONS
// ----------------------------------------------------------------------
// Imports needed by getTVShowData and generateMetadata.
import axios from "axios";
import { TVShowClientComponent } from "./TvShowClientComponent";

// Define server list outside of the component for consistency
const servers = [
    { id: 1, name: "Server 1 - Premium", quality: "1080p", ping: 45, status: "online", location: "US East", flag: "🇺🇸", type: "premium", speed: "Ultra Fast", baseUrl: "https://vidsrc.me/embed/tv" },
    { id: 2, name: "Server 2 - Standard", quality: "720p", ping: 67, status: "online", location: "US West", flag: "🇺🇸", type: "standard", speed: "Fast", baseUrl: "https://embed.su/embed/tv" },
    { id: 3, name: "Server 3 - Premium", quality: "1080p", ping: 52, status: "online", location: "EU Central", flag: "🇪🇺", type: "premium", speed: "Ultra Fast", baseUrl: "https://putlocker.vip/embed/tv" },
    { id: 4, name: "Server 4 - Basic", quality: "720p", ping: 73, status: "online", location: "Asia", flag: "🌏", type: "basic", speed: "Medium", baseUrl: "https://vidsrc.icu/embed/tv" },
    { id: 5, name: "Server 5 - Ultra", quality: "4K", ping: 38, status: "online", location: "UK", flag: "🇬🇧", type: "ultra", speed: "Lightning", baseUrl: "https://vidlink.pro/tv" },
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
// 2. DYNAMIC METADATA FUNCTION (Server Component)
// ----------------------------------------------------------------------

export async function generateMetadata({ params }) {
    const tvShow = await getTVShowData(params.id);

    if (!tvShow) {
        return { title: "TV Show Not Found" };
    }

    const firstAirYear = tvShow.first_air_date ? new Date(tvShow.first_air_date).getFullYear() : 'N/A';

    return {
        title: `${tvShow.name} (${firstAirYear})`,
        description: tvShow.overview
            ? tvShow.overview.substring(0, 160) + '...'
            : `Watch the TV show ${tvShow.name} with multiple server options.`,
        openGraph: {
            title: `${tvShow.name} | Watch Series Now on Film Guild`,
            description: tvShow.overview,
            images: [
                {
                    url: tvShow.backdrop_path
                        ? `https://image.tmdb.org/t/p/original${tvShow.backdrop_path}`
                        : '/opengraph-image.png',
                    width: 1200,
                    height: 630,
                    alt: tvShow.name,
                },
            ],
        },
    };
}

// ----------------------------------------------------------------------
// 3. MAIN SERVER COMPONENT
// ----------------------------------------------------------------------
// This component fetches the initial data and passes it to the Client Component.
export default async function ServerTVPage({ params }) {
    const tvShow = await getTVShowData(params.id);

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


// ----------------------------------------------------------------------
// 4. CLIENT COMPONENT IMPORTS AND DIRECTIVE
// ----------------------------------------------------------------------


// ----------------------------------------------------------------------
// 5. CLIENT COMPONENT DEFINITION
// ----------------------------------------------------------------------

