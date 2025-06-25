/** @type {import('next').NextConfig} */
const fs = require('fs');

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['image.tmdb.org', ], // Add the hostnames of external image URLs
  },
}

module.exports = nextConfig