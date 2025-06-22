/** @type {import('next').NextConfig} */
const fs = require('fs');


const dotenv = require('dotenv');

const env = dotenv.parse(fs.readFileSync('.env'));

const nextConfig = {
  reactStrictMode: true,
  env: env,
  images: {
    domains: ['image.tmdb.org'], // Add the hostnames of external image URLs
  },
}

module.exports = nextConfig