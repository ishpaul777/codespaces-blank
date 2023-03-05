/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    tagoreAPIURL: process.env.NEXT_PUBLIC_API_URL,
  },
};

module.exports = nextConfig;
