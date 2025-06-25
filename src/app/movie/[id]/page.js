"use client";
import { Loading } from "@/components/ui/loading";
import { fetchDetails } from "@/redux/DetailsSlice";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Star,
  Play,
  Heart,
  Share2,
  Calendar,
  Clock,
  DollarSign,
  Award,
  Globe,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

// Utility functions
const formatCurrency = (amount) => {
  if (!amount) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatRuntime = (minutes) => {
  if (!minutes) return "N/A";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

const getReleaseYear = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).getFullYear();
};

const Page = () => {
  const { statusMovie, movieDetails } = useSelector((state) => state.details);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    dispatch(fetchDetails(id));
  }, [dispatch, id]);

  if (statusMovie === "pending") {
    return <Loading />;
  }

  if (!movieDetails) {
    return (
      <div className="min-h-screen bg-white text-white flex items-center justify-center p-4">
        <p className="text-center">Movie not found</p>
      </div>
    );
  }

  const backdropUrl = `${process.env.NEXT_PUBLIC_BACKDROP_URL}${movieDetails.backdrop_path}`;
  const posterUrl = `${process.env.NEXT_PUBLIC_BACKDROP_URL}${movieDetails.poster_path}`;
  const releaseYear = getReleaseYear(movieDetails.release_date);
  const formattedRuntime = formatRuntime(movieDetails.runtime);
  const formattedBudget = formatCurrency(movieDetails.budget);
  const formattedRevenue = formatCurrency(movieDetails.revenue);

  return (
    <div className="min-h-screen bg-black text-white pb-16">
      {/* Hero Section */}
      <div className="relative h-[80vh] sm:h-[80vh] lg:h-[70vh] overflow-hidden">
        <Image
          width={256}
          height={384}
          src={backdropUrl || "/placeholder.svg"}
          alt={movieDetails.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
            {/* Movie Poster */}
            <div className="flex-shrink-0 flex justify-center lg:justify-start">
              <Image
                src={posterUrl || "/placeholder.svg"}
                alt={movieDetails.title}
                width={256}
                height={384}
                className="w-40 h-60 sm:w-48 sm:h-72 lg:w-64 lg:h-96 object-cover rounded-lg shadow-2xl"
              />
            </div>

            {/* Movie Info */}
            <div className="flex-1 space-y-2 sm:space-y-3 lg:space-y-4 text-center lg:text-left">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-1 sm:mb-2 leading-tight">
                  {movieDetails.title}
                </h1>
                {movieDetails.tagline && (
                 <p className="text-sm sm:text-lg lg:text-xl text-gray-400 italic mb-2 sm:mb-4">
                 &quot;{movieDetails?.tagline || 'No tagline available'}&quot;
               </p>
                )}
                <div className="flex items-center justify-center lg:justify-start gap-2 sm:gap-4 text-xs sm:text-sm lg:text-base text-white flex-wrap">
                  <span>{releaseYear}</span>
                  <span>•</span>
                  <span>{movieDetails.adult ? "R" : "PG-13"}</span>
                  <span>•</span>
                  <span>{formattedRuntime}</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline">
                    {movieDetails.status}
                  </span>
                </div>
              </div>

              {/* Genres */}
              {movieDetails.genres && (
                <div className="flex gap-1 sm:gap-2 flex-wrap justify-center lg:justify-start">
                  {movieDetails.genres.map((genre) => (
                    <Badge
                      key={genre.id}
                      variant="secondary"
                      className="bg-gray-700 text-white text-xs sm:text-sm"
                    >
                      {genre.name}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Ratings */}
              <div className="flex items-center justify-center lg:justify-start gap-3 sm:gap-6 flex-wrap">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                  <span className="text-lg sm:text-xl font-semibold">
                    {movieDetails.vote_average?.toFixed(1) || "N/A"}
                  </span>
                  <span className="text-gray-400 text-sm">/10</span>
                  {movieDetails.vote_count && (
                    <span className="text-xs text-gray-400 hidden sm:inline">
                      ({movieDetails.vote_count.toLocaleString()} votes)
                    </span>
                  )}
                </div>
                {movieDetails.popularity && (
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold">📊</span>
                    </div>
                    <span className="text-lg sm:text-xl font-semibold">
                      {Math.round(movieDetails.popularity)}
                    </span>
                    <span className="text-gray-400 text-sm hidden sm:inline">
                      Popularity
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-2 sm:pt-4">
                <Button
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 w-full sm:w-auto text-white"
                >
                  <Link href={`/watch/movie/${id}`} className="flex items-center">
                  <Play className="w-4 h-4 mr-2" />
                  Watch
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsWatchlisted(!isWatchlisted)}
                  className={`border-gray-600 w-full sm:w-auto ${
                    isWatchlisted
                      ? "bg-red-600 text-white"
                      : "text-white hover:bg-gray-800"
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 mr-2 ${
                      isWatchlisted ? "fill-current" : ""
                    }`}
                  />
                  {isWatchlisted ? "In Watchlist" : "Add to Watchlist"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-600 text-white hover:bg-gray-800 w-full sm:w-auto"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Navigation Tabs */}
        <div className="flex gap-4 sm:gap-8 border-b border-gray-700 mb-6 sm:mb-8 overflow-x-auto">
          {["overview", "production", "collection", "details"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-2 capitalize font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
                activeTab === tab
                  ? "text-red-500 border-b-2 border-red-500"
                  : "text-white hover:text-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-4">Overview</h2>
                <p className="text-gray-300 leading-relaxed text-sm sm:text-base lg:text-lg">
                  {movieDetails.overview || "No overview available."}
                </p>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-4">
                  Key Stats
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-3 sm:p-4 text-center">
                      <Calendar className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-blue-400" />
                      <div className="text-lg sm:text-2xl font-bold">
                        {releaseYear}
                      </div>
                      <div className="text-white text-xs sm:text-sm">
                        Release Year
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-3 sm:p-4 text-center">
                      <Clock className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-green-400" />
                      <div className="text-lg sm:text-2xl font-bold">
                        {formattedRuntime}
                      </div>
                      <div className="text-white text-xs sm:text-sm">
                        Runtime
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-3 sm:p-4 text-center">
                      <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-purple-400" />
                      <div className="text-sm sm:text-lg font-bold">
                        {formattedBudget}
                      </div>
                      <div className="text-white text-xs sm:text-sm">
                        Budget
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-3 sm:p-4 text-center">
                      <Award className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-yellow-400" />
                      <div className="text-sm sm:text-lg font-bold">
                        {formattedRevenue}
                      </div>
                      <div className="text-white text-xs sm:text-sm">
                        Box Office
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg sm:text-xl font-bold mb-4">
                  Release Info
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-white">Status:</span>
                    <span>{movieDetails.status || "Unknown"}</span>
                  </div>
                  {movieDetails.release_date && (
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-white">Release Date:</span>
                      <span>
                        {new Date(
                          movieDetails.release_date
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {movieDetails.original_language && (
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-white">Original Language:</span>
                      <span>
                        {movieDetails.original_language.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {movieDetails.spoken_languages &&
                movieDetails.spoken_languages.length > 0 && (
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold mb-4">
                      Languages
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {movieDetails.spoken_languages.map((lang) => (
                        <Badge
                          key={lang.iso_639_1}
                          variant="outline"
                          className="border-gray-600 text-gray-300 text-xs"
                        >
                          {lang.english_name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

              {movieDetails.production_countries &&
                movieDetails.production_countries.length > 0 && (
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold mb-4">
                      Countries
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {movieDetails.production_countries.map((country) => (
                        <Badge
                          key={country.iso_3166_1}
                          variant="outline"
                          className="border-gray-600 text-gray-300 text-xs"
                        >
                          <Globe className="w-3 h-3 mr-1" />
                          {country.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

              {movieDetails.homepage && (
                <div>
                  <h3 className="text-lg sm:text-xl font-bold mb-4">
                    Official Website
                  </h3>
                  <a
                    href={movieDetails.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline text-sm sm:text-base break-all"
                  >
                    Visit Official Site
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "production" && movieDetails.production_companies && (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-6">
              Production Companies
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {movieDetails.production_companies.map((company) => (
                <Card key={company.id} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center space-x-4">
                      {company.logo_path ? (
                        <Image
                          width={256}
                          height={384}
                          src={`${process.env.NEXT_PUBLIC_BACKDROP_URL}${company.logo_path}`}
                          alt={company.name}
                          className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                        />
                      ) : (
                        <Building className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-sm sm:text-base truncate">
                          {company.name}
                        </h3>
                        <p className="text-white text-xs sm:text-sm">
                          {company.origin_country || "Unknown"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "collection" && movieDetails.belongs_to_collection && (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-6">
              Part of Collection
            </h2>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <Image
                    width={256}
                    height={384}
                    src={`${
                      process.env.NEXT_PUBLIC_BACKDROP_URL
                    }${movieDetails.belongs_to_collection.poster_path}`}
                    alt={movieDetails.belongs_to_collection.name}
                    className="w-32 h-48 sm:w-48 sm:h-72 object-cover rounded-lg mx-auto sm:mx-0"
                  />
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-xl sm:text-2xl font-bold mb-4">
                      {movieDetails.belongs_to_collection.name}
                    </h3>
                    <p className="text-white mb-4 text-sm sm:text-base">
                      This movie is part of the{" "}
                      {movieDetails.belongs_to_collection.name}. Explore other
                      movies in this collection to discover the complete story.
                    </p>
                    <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                      View Collection
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "details" && (
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-6">
                Technical Details
              </h2>
              <div className="space-y-4">
                {movieDetails.id && (
                  <div className="flex justify-between py-2 border-b border-gray-700 text-sm sm:text-base">
                    <span className="text-white">TMDB ID</span>
                    <span>{movieDetails.id}</span>
                  </div>
                )}
                {movieDetails.imdb_id && (
                  <div className="flex justify-between py-2 border-b border-gray-700 text-sm sm:text-base">
                    <span className="text-white">IMDb ID</span>
                    <span>{movieDetails.imdb_id}</span>
                  </div>
                )}
                {movieDetails.original_title && (
                  <div className="flex justify-between py-2 border-b border-gray-700 text-sm sm:text-base">
                    <span className="text-white">Original Title</span>
                    <span className="text-right ml-4 break-words">
                      {movieDetails.original_title}
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-gray-700 text-sm sm:text-base">
                  <span className="text-white">Adult Content</span>
                  <span>{movieDetails.adult ? "Yes" : "No"}</span>
                </div>
                {movieDetails.popularity && (
                  <div className="flex justify-between py-2 border-b border-gray-700 text-sm sm:text-base">
                    <span className="text-white">Popularity Score</span>
                    <span>{movieDetails.popularity.toFixed(1)}</span>
                  </div>
                )}
                {movieDetails.vote_count && (
                  <div className="flex justify-between py-2 border-b border-gray-700 text-sm sm:text-base">
                    <span className="text-white">Vote Count</span>
                    <span>{movieDetails.vote_count.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-6">
                Financial Information
              </h2>
              <div className="space-y-4">
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-green-400" />
                      <div className="text-lg sm:text-2xl font-bold text-green-400">
                        {formattedBudget}
                      </div>
                      <div className="text-white text-sm">
                        Production Budget
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <Award className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-yellow-400" />
                      <div className="text-lg sm:text-2xl font-bold text-yellow-400">
                        {formattedRevenue}
                      </div>
                      <div className="text-white text-sm">
                        Box Office Revenue
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {movieDetails.revenue > 0 && movieDetails.budget > 0 && (
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-lg sm:text-2xl font-bold text-blue-400">
                          {(
                            (movieDetails.revenue / movieDetails.budget) *
                            100
                          ).toFixed(0)}
                          %
                        </div>
                        <div className="text-white text-sm">
                          Return on Investment
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
