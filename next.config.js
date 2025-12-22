/** @type {import('next').NextConfig} */
const imageDomains = process.env.NEXT_PUBLIC_IMAGE_DOMAINS
  ? process.env.NEXT_PUBLIC_IMAGE_DOMAINS.split(',').map((domain) => domain.trim()).filter(Boolean)
  : [];

const nextConfig = {
  images: {
    domains: imageDomains,
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
