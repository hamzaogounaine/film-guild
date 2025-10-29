import axios from "axios";
import { MovieClientComponent } from "./MovieClientComponent";


// ----------------------------------------------------------------------
// 1. SHARED DATA FETCHING FUNCTION (Server Side)
// ----------------------------------------------------------------------

// This function runs on the server for both metadata and initial page data.
async function getMovieData(id) {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API}`,
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching movie data:", error);
    // Return a flag or null if data fails to fetch
    return null;
  }
}

// ----------------------------------------------------------------------
// 2. DYNAMIC METADATA FUNCTION (Server Component)
// ----------------------------------------------------------------------
// This runs before the component and sets the head tags.

// ----------------------------------------------------------------------
// 3. PAGE COMPONENT (Server Component Wrapper)
// ----------------------------------------------------------------------
// This is now a Server Component that fetches data and passes it to the Client Component.

// Define server list outside of the component for consistency
const servers = [
    { id: 1, name: "Server 1 - Premium", quality: "1080p", ping: 45, status: "online", location: "US East", flag: "🇺🇸", type: "premium", speed: "Ultra Fast", baseUrl: "https://vidsrc.me/embed/movie" },
    { id: 2, name: "Server 2 - Standard", quality: "720p", ping: 67, status: "online", location: "US West", flag: "🇺🇸", type: "standard", speed: "Fast", baseUrl: "https://embed.su/embed/movie" },
    { id: 3, name: "Server 3 - Premium", quality: "1080p", ping: 52, status: "online", location: "EU Central", flag: "🇪🇺", type: "premium", speed: "Ultra Fast", baseUrl: "https://putlocker.vip/embed/movie" },
    { id: 4, name: "Server 4 - Basic", quality: "720p", ping: 73, status: "online", location: "Asia", flag: "🌏", type: "basic", speed: "Medium", baseUrl: "https://vidsrc.icu/embed/movie" },
    { id: 5, name: "Server 5 - Ultra", quality: "4K", ping: 38, status: "online", location: "UK", flag: "🇬🇧", type: "ultra", speed: "Lightning", baseUrl: "https://vidlink.pro/movie" },
    { id: 6, name: "Server 6 - Basic", quality: "480p", ping: 89, status: "online", location: "Canada", flag: "🇨🇦", type: "basic", speed: "Medium", baseUrl: "https://vidsrc.net/embed/movie" },
    { id: 7, name: "Server 7 - Standard", quality: "1080p", ping: 124, status: "online", location: "Australia", flag: "🇦🇺", type: "standard", speed: "Fast", baseUrl: "https://www.2embed.cc/embed" }
];

export default async function ServerMoviePage({ params }) {
    const movie = await getMovieData(params.id);

    if (!movie) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <h1 className="text-white text-2xl">Movie not found. Please check the ID.</h1>
            </div>
        );
    }

    // Pass the initial server-fetched data to the client component
    return <MovieClientComponent initialMovieData={movie} movieId={params.id} servers={servers} />;
}

// ----------------------------------------------------------------------
// 4. CLIENT COMPONENT (Interactivity and State)
// ----------------------------------------------------------------------
// This component handles all state, effects, and user interaction.

